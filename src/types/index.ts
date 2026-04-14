export interface ProjectDetail {
  subtitle: string;
  content: string;
}

export type ModalType = "default" | "image_focus";

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  tags: string[];
  period: string;
  institution?: string;
  details?: ProjectDetail[];
  modalType?: ModalType;
}
