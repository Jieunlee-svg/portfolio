import { supabase } from "@/lib/supabase";

export interface ProfileData {
  id: string;
  name: string;
  role: string;
  location: string;
  coverImage: string | null;
  profileImage: string | null;
  company: { name: string; logoUrl: string | null } | null;
  university: { name: string; logoUrl: string | null } | null;
}

export interface ProfileUpdateData {
  name: string;
  role: string;
  location: string;
  coverImage: string;
  profileImage: string;
  companyName: string;
  companyLogoUrl: string;
  universityName: string;
  universityLogoUrl: string;
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
    company: data.company_name
      ? { name: data.company_name, logoUrl: data.company_logo_url }
      : null,
    university: data.university_name
      ? { name: data.university_name, logoUrl: data.university_logo_url }
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
      company_name: data.companyName || null,
      company_logo_url: data.companyLogoUrl || null,
      university_name: data.universityName || null,
      university_logo_url: data.universityLogoUrl || null,
    })
    .eq("id", id);

  if (error) throw error;
}
