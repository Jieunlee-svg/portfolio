import { supabase } from "@/lib/supabase";
import type { ProjectData, ModalType } from "@/types";

export interface ProjectFormValues {
  title: string;
  description: string;
  period: string;
  institution: string;
  imageUrl: string;
  tags: string[];
  details: { subtitle: string; content: string }[];
  images: string[];
  modalType: ModalType;
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
      modal_type,
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
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .map((img: { url: string }) => img.url),
    tags: p.tags,
    period: p.period,
    institution: p.institution ?? undefined,
    modalType: (p.modal_type ?? "default") as ModalType,
    details: p.project_details
      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
      .map((d: { subtitle: string; content: string }) => ({ subtitle: d.subtitle, content: d.content })),
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
      modal_type: form.modalType,
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
      modal_type: form.modalType,
    })
    .eq("id", id);

  if (error) throw error;

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
