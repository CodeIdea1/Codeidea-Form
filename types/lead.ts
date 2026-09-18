import { Timestamp } from "firebase/firestore";

export type LeadStatus = "new" | "contacted" | "meeting" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  interest: string;
  createdAt: Timestamp;
  status: LeadStatus;
}

export interface LeadFormData {
  name: string;
  email: string;
  whatsapp: string;
  interest: string;
}
