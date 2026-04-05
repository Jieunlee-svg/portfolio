export interface ProjectDetail {
  subtitle: string;
  content: string;
}

export interface ProjectData {
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  tags: string[];
  period: string;
  institution?: string;
  details?: ProjectDetail[];
}
