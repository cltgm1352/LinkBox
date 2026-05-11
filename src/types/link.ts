export interface LinkItem {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
  createdAt: number;
}

export type ViewMode = "list" | "grid";
