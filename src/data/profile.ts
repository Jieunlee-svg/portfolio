import { supabase } from "@/lib/supabase";

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  coverImage: string | null;
  profileImage: string | null;
  company: { name: string; logoUrl: string | null } | null;
  university: { name: string; logoUrl: string | null } | null;
}

export async function fetchProfile(): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    name: data.name,
    role: data.role,
    location: data.location,
    coverImage: data.cover_image,
    profileImage: data.profile_image,
    company: data.company_name
      ? { name: data.company_name, logoUrl: data.company_logo_url }
      : null,
    university: data.university_name
      ? { name: data.university_name, logoUrl: data.university_logo_url }
      : null,
  };
}
