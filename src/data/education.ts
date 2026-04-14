import { supabase } from "@/lib/supabase";

export interface Education {
  id: string;
  schoolName: string;
  logoUrl: string | null;
  degree: string | null;
  field: string | null;
  startYear: string | null;
  endYear: string | null;
  displayOrder: number;
}

export interface EducationFormValues {
  schoolName: string;
  logoUrl: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export async function fetchEducation(profileId: string): Promise<Education[]> {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("profile_id", profileId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((e) => ({
    id: e.id,
    schoolName: e.school_name,
    logoUrl: e.logo_url,
    degree: e.degree,
    field: e.field,
    startYear: e.start_year,
    endYear: e.end_year,
    displayOrder: e.display_order,
  }));
}

export async function createEducation(profileId: string, form: EducationFormValues, order: number): Promise<void> {
  const { error } = await supabase.from("education").insert({
    profile_id: profileId,
    school_name: form.schoolName,
    logo_url: form.logoUrl || null,
    degree: form.degree || null,
    field: form.field || null,
    start_year: form.startYear || null,
    end_year: form.endYear || null,
    display_order: order,
  });
  if (error) throw error;
}

export async function updateEducation(id: string, form: EducationFormValues): Promise<void> {
  const { error } = await supabase.from("education").update({
    school_name: form.schoolName,
    logo_url: form.logoUrl || null,
    degree: form.degree || null,
    field: form.field || null,
    start_year: form.startYear || null,
    end_year: form.endYear || null,
  }).eq("id", id);
  if (error) throw error;
}

export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
}
