import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  User, 
  signOut 
} from "firebase/auth";
import { auth } from "./firebase";

export const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/spreadsheets.readonly"
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: "consent",
  access_type: "offline"
});

// Cache token in memory
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Could not acquire Google OAuth access token.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface SpreadsheetFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
  owners?: { displayName: string; emailAddress: string; photoLink?: string }[];
  size?: string;
}

export interface SheetMetadata {
  spreadsheetId: string;
  properties: {
    title: string;
    locale?: string;
    timeZone?: string;
  };
  sheets: {
    properties: {
      sheetId: number;
      title: string;
      gridProperties?: {
        rowCount: number;
        columnCount: number;
      };
    };
  }[];
  spreadsheetUrl: string;
}

// 1. List user's Google Sheets
export async function listUserSpreadsheets(token: string): Promise<SpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const fields = encodeURIComponent("files(id, name, modifiedTime, webViewLink, owners)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc&pageSize=30`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list spreadsheets (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

// 2. Get Spreadsheet metadata (Tabs, Properties)
export async function getSpreadsheetDetails(token: string, spreadsheetId: string): Promise<SheetMetadata> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch spreadsheet details (HTTP ${response.status})`);
  }

  return response.json();
}

// 3. Read Values from a sheet tab / range
export async function getSheetValues(token: string, spreadsheetId: string, range: string): Promise<string[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read sheet data (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data.values || [];
}

// 4. Create a new Google Spreadsheet
export async function createNewSpreadsheet(
  token: string, 
  title: string, 
  sheetTitle: string = "Sheet1", 
  headers?: string[], 
  rows?: (string | number)[][]
): Promise<SheetMetadata> {
  const url = "https://sheets.googleapis.com/v4/spreadsheets";
  const body: any = {
    properties: {
      title: title || "NEXUS Telemetry Export"
    },
    sheets: [
      {
        properties: {
          title: sheetTitle
        }
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create spreadsheet (HTTP ${response.status})`);
  }

  const created: SheetMetadata = await response.json();

  if (headers && headers.length > 0) {
    const valuesToInsert = [headers, ...(rows || [])];
    await updateSheetRange(token, created.spreadsheetId, `${sheetTitle}!A1`, valuesToInsert);
  }

  return created;
}

// 5. Append Rows to a Spreadsheet
export async function appendSheetRows(
  token: string, 
  spreadsheetId: string, 
  range: string, 
  values: (string | number)[][]
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      values
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to append rows (HTTP ${response.status})`);
  }

  return response.json();
}

// 6. Update Sheet Range
export async function updateSheetRange(
  token: string, 
  spreadsheetId: string, 
  range: string, 
  values: (string | number)[][]
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      values
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to update sheet range (HTTP ${response.status})`);
  }

  return response.json();
}

// 7. Clear Sheet Values
export async function clearSheetRange(token: string, spreadsheetId: string, range: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to clear sheet (HTTP ${response.status})`);
  }

  return response.json();
}

// 8. Delete a spreadsheet file from Google Drive
export async function deleteSpreadsheetFile(token: string, fileId: string) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file (HTTP ${response.status})`);
  }

  return true;
}
