// Shared types for the Drive UI

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface DriveImage {
  key: string;
  url: string;
  size: number;
  uploadedAt: string;
  folderId?: string | null;
  name?: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  target: { type: "image"; item: DriveImage } | { type: "folder"; item: Folder };
}

export type ViewMode = "grid" | "list";
