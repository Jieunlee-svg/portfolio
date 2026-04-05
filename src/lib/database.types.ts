export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          tags: string[];
          period: string;
          institution: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          url: string;
          order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["project_images"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["project_images"]["Insert"]>;
      };
      project_details: {
        Row: {
          id: string;
          project_id: string;
          subtitle: string;
          content: string;
          order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["project_details"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["project_details"]["Insert"]>;
      };
      profile: {
        Row: {
          id: string;
          name: string;
          role: string;
          location: string;
          cover_image: string | null;
          profile_image: string | null;
          company_name: string | null;
          company_logo_url: string | null;
          university_name: string | null;
          university_logo_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["profile"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
      };
    };
  };
};
