// @/types/document.ts
// types/document.ts

export interface PinataFile {
  ipfs_pin_hash: string;
  size: number;
  pinataMetadata: {
    name: string;
    status: string;
  };
}

export type DocumentStatus = 'approved' | 'denied' | 'pending';

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  status: DocumentStatus;  // status can only be 'approved', 'denied', or 'pending'
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}