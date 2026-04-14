import { supabase } from "@/lib/supabase";
import type { ProjectData } from "@/types";

export interface ProjectFormValues {
  title: string;
  description: string;
  period: string;
  institution: string;
  imageUrl: string;
  tags: string[];
  details: { subtitle: string; content: string }[];
  images: string[];
}

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

export async function createProject(form: ProjectFormValues): Promise<void> {
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      title: form.title,
      description: form.description,
      period: form.period,
      institution: form.institution || null,
      image_url: form.imageUrl || null,
      tags: form.tags,
    })
    .select("id")
    .single();

  if (error) throw error;

  const projectId = project.id;

  if (form.details.length > 0) {
    const { error: detailsError } = await supabase.from("project_details").insert(
      form.details.map((d, i) => ({
        project_id: projectId,
        subtitle: d.subtitle,
        content: d.content,
        order: i,
      }))
    );
    if (detailsError) throw detailsError;
  }

  if (form.images.length > 0) {
    const { error: imagesError } = await supabase.from("project_images").insert(
      form.images.map((url, i) => ({
        project_id: projectId,
        url,
        order: i,
      }))
    );
    if (imagesError) throw imagesError;
  }
}

export async function updateProject(id: string, form: ProjectFormValues): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .update({
      title: form.title,
      description: form.description,
      period: form.period,
      institution: form.institution || null,
      image_url: form.imageUrl || null,
      tags: form.tags,
    })
    .eq("id", id);

  if (error) throw error;

  // 기존 details/images 삭제 후 재삽입
  await supabase.from("project_details").delete().eq("project_id", id);
  await supabase.from("project_images").delete().eq("project_id", id);

  if (form.details.length > 0) {
    const { error: detailsError } = await supabase.from("project_details").insert(
      form.details.map((d, i) => ({
        project_id: id,
        subtitle: d.subtitle,
        content: d.content,
        order: i,
      }))
    );
    if (detailsError) throw detailsError;
  }

  if (form.images.length > 0) {
    const { error: imagesError } = await supabase.from("project_images").insert(
      form.images.map((url, i) => ({
        project_id: id,
        url,
        order: i,
      }))
    );
    if (imagesError) throw imagesError;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
