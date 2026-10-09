import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Analytics conditionally (safeguarded for browser/iframe environment)
export const analyticsPromise = isSupported()
  .then((supported) => {
    if (supported && firebaseConfig.measurementId && firebaseConfig.measurementId.trim() !== "") {
      try {
        return getAnalytics(app);
      } catch (err) {
        console.warn("Analytics initialization skipped:", err);
        return null;
      }
    }
    return null;
  })
  .catch((err) => {
    console.warn("Analytics not supported in this environment:", err);
    return null;
  });

// Validate Connection to Firestore on initial boot gracefully
async function testConnection() {
  try {
    if (typeof window !== "undefined" && navigator.onLine) {
      await getDocFromServer(doc(db, "test", "connection"));
    }
  } catch (error) {
    // Gracefully ignore initial offline cache / initial handshake warmup
    console.debug("Firestore initial probe status:", error);
  }
}
testConnection();

export default app;
