import { supabase } from "@/lib/supabase";

export interface Experience {
  id: string;
  title: string;
  company: string;
  logoUrl: string | null;
  employmentType: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  locationType: string | null;
  skills: string[];
  displayOrder: number;
}

export interface ExperienceFormValues {
  title: string;
  company: string;
  logoUrl: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  locationType: string;
  skills: string;
}

export async function fetchExperiences(profileId: string): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", profileId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    logoUrl: e.logo_url,
    employmentType: e.employment_type,
    startDate: e.start_date,
    endDate: e.end_date,
    isCurrent: e.is_current,
    locationType: e.location_type,
    skills: e.skills ?? [],
    displayOrder: e.display_order,
  }));
}

export async function createExperience(profileId: string, form: ExperienceFormValues, order: number): Promise<void> {
  const { error } = await supabase.from("experiences").insert({
    profile_id: profileId,
    title: form.title,
    company: form.company,
    logo_url: form.logoUrl || null,
    employment_type: form.employmentType || null,
    start_date: form.startDate,
    end_date: form.isCurrent ? null : form.endDate || null,
    is_current: form.isCurrent,
    location_type: form.locationType || null,
    skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    display_order: order,
  });
  if (error) throw error;
}

export async function updateExperience(id: string, form: ExperienceFormValues): Promise<void> {
  const { error } = await supabase.from("experiences").update({
    title: form.title,
    company: form.company,
    logo_url: form.logoUrl || null,
    employment_type: form.employmentType || null,
    start_date: form.startDate,
    end_date: form.isCurrent ? null : form.endDate || null,
    is_current: form.isCurrent,
    location_type: form.locationType || null,
    skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
  }).eq("id", id);
  if (error) throw error;
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}
