export type MediaType = "youtube" | "vimeo" | "video" | "image";

export function getMediaType(url: string): MediaType {
  if (!url) return "image";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  if (/\.(mp4|webm|mov|avi)(\?|$)/i.test(url)) return "video";
  return "image";
}

export function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

export function getYoutubeThumbnail(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export function getYoutubeEmbedUrl(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : "";
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function getVimeoEmbedUrl(url: string): string {
  const id = getVimeoId(url);
  return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : "";
}
