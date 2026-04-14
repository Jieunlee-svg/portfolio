import { supabase } from "@/lib/supabase";

export interface CompanyEntry {
  name: string;
  logoUrl: string;
  url: string;
}

export interface ProfileData {
  id: string;
  name: string;
  role: string;
  location: string;
  coverImage: string | null;
  profileImage: string | null;
  companies: CompanyEntry[];
  university: { name: string; logoUrl: string | null; url: string | null } | null;
}

export interface ProfileUpdateData {
  name: string;
  role: string;
  location: string;
  coverImage: string;
  profileImage: string;
  companies: CompanyEntry[];
  universityName: string;
  universityLogoUrl: string;
  universityUrl: string;
}

export async function fetchProfile(): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    role: data.role,
    location: data.location,
    coverImage: data.cover_image,
    profileImage: data.profile_image,
    companies: Array.isArray(data.companies) ? data.companies : [],
    university: data.university_name
      ? { name: data.university_name, logoUrl: data.university_logo_url, url: data.university_url ?? null }
      : null,
  };
}

export async function updateProfile(id: string, data: ProfileUpdateData): Promise<void> {
  const { error } = await supabase
    .from("profile")
    .update({
      name: data.name,
      role: data.role,
      location: data.location,
      cover_image: data.coverImage || null,
      profile_image: data.profileImage || null,
      companies: data.companies,
      university_name: data.universityName || null,
      university_logo_url: data.universityLogoUrl || null,
      university_url: data.universityUrl || null,
    })
    .eq("id", id);

  if (error) throw error;
}
