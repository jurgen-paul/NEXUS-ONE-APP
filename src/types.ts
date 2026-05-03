export enum Module {
  DASHBOARD = "DASHBOARD",
  AI_ENGINE = "AI_ENGINE",
  SOCIAL = "SOCIAL",
  MARKETING = "MARKETING",
  NAVIGATION = "NAVIGATION",
  CREATOR = "CREATOR",
  DOCS = "DOCS",
  DEPLOYMENT = "DEPLOYMENT",
  COMMUNICATION = "COMMUNICATION",
  SALES = "SALES",
  SETTINGS = "SETTINGS",
}

export interface NavItem {
  id: Module;
  label: string;
  icon: string;
  description: string;
}
