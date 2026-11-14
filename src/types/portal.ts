export type PageStatus = 'en_ligne' | 'en_cours' | 'archive';

export type PageVisibility = 'public' | 'private';

export type PreviewViewportMode = 'desktop' | 'tablet' | 'mobile';

export type ViewMode = 'grid' | 'register';

export interface WebCollection {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface WebPageEntry {
  id: string;
  title: string;
  url: string;
  archiveCode: string;
  summary: string;
  notes?: string;
  collectionId: string;
  tags: string[];
  coverImage?: string;
  status: PageStatus;
  visibility: PageVisibility;
  isFeatured: boolean;
  isPinned: boolean;
  createdYear: number;
  updatedAt: string;
}

export interface PortalBackupPayload {
  version: number;
  exportedAt: string;
  collections: WebCollection[];
  pages: WebPageEntry[];
}
