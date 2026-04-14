export interface ProjectDetail {
  subtitle: string;
  content: string;
}

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
}
