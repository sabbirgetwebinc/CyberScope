
export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  owaspCategory: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  dateFound: string;
  affectedAsset: string;
}

export interface Scan {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'Completed' | 'Failed' | 'Running';
  vulnerabilitiesFound: number;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  lastScan: string;
  status: 'Active' | 'Inactive';
  riskScore: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  avatarUrl: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'scan';
  source?: string;
}

export interface ScanResults {
  subdomains: string[];
  ports: string[];
  vulnsFound: number;
  paths: string[];
}
