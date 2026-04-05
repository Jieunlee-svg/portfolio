import { supabase } from "@/lib/supabase";
import type { ProjectData } from "@/types";

export async function fetchProjects(): Promise<ProjectData[]> {
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      title,
      description,
      image_url,
      tags,
      period,
      institution,
      project_images ( url, order ),
      project_details ( subtitle, content, order )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!projects) return [];

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.image_url ?? undefined,
    images: p.project_images
      .sort((a, b) => a.order - b.order)
      .map((img) => img.url),
    tags: p.tags,
    period: p.period,
    institution: p.institution ?? undefined,
    details: p.project_details
      .sort((a, b) => a.order - b.order)
      .map((d) => ({ subtitle: d.subtitle, content: d.content })),
  }));
}
