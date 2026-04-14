import { useState } from "react";
import { X, ChevronLeft, ChevronRight, CalendarRange, Building2, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getTagColor } from "@/constants/colors";
import { getMediaType, getYoutubeThumbnail, getYoutubeEmbedUrl, getVimeoEmbedUrl } from "@/lib/media";
import type { ProjectData } from "@/types";

interface ProjectDetailModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

function MediaPlayer({ url, alt }: { url: string; alt: string }) {
  const [playing, setPlaying] = useState(false);
  const type = getMediaType(url);

  if (type === "youtube") {
    if (playing) {
      return (
        <iframe
          src={getYoutubeEmbedUrl(url)}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
    const thumb = getYoutubeThumbnail(url);
    return (
      <div className="relative w-full h-full cursor-pointer" onClick={() => setPlaying(true)}>
        <img src={thumb} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-7 h-7 text-[#323338] ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "vimeo") {
    if (playing) {
      return (
        <iframe
          src={getVimeoEmbedUrl(url)}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
    return (
      <div className="relative w-full h-full cursor-pointer bg-black flex items-center justify-center" onClick={() => setPlaying(true)}>
        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <Play className="w-7 h-7 text-[#323338] ml-1" fill="currentColor" />
        </div>
        <p className="absolute bottom-4 text-white/70 text-sm">Vimeo 동영상</p>
      </div>
    );
  }

  if (type === "video") {
    return <video src={url} controls className="w-full h-full object-contain bg-black" />;
  }

  return <ImageWithFallback src={url} alt={alt} className="w-full h-full object-contain" />;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !project) return null;

  const mediaList =
    project.images && project.images.length > 0
      ? project.images
      : project.imageUrl
      ? [project.imageUrl]
      : [];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);

  const isImageFocus = project.modalType === "image_focus";

  // ─── 이미지 집중 포맷 ───────────────────────────────────────────
  if (isImageFocus) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#323338]/40 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-[#323338] rounded-full hover:bg-white hover:scale-110 shadow-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 상단 정보 */}
          <div className="px-8 py-6 flex-shrink-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag, idx) => (
                <span key={idx} className={`px-3 py-1 text-[12px] font-medium uppercase tracking-wider rounded-sm ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-[24px] font-semibold text-[#323338] leading-tight mb-3">{project.title}</h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-[#676879]">
              <div className="flex items-center gap-2">
                <CalendarRange className="w-4 h-4" />
                <span>{project.period}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{project.institution || "—"}</span>
              </div>
            </div>
          </div>

          {/* 풀 미디어 */}
          <div className="relative flex-1 bg-[#f5f6f8] overflow-hidden" style={{ minHeight: "400px" }}>
            {mediaList.length > 0 ? (
              <>
                <div className="w-full h-full absolute inset-0">
                  <MediaPlayer url={mediaList[currentIndex]} alt={project.title} key={mediaList[currentIndex]} />
                </div>
                {mediaList.length > 1 && (
                  <>
                    <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur rounded-full hover:bg-white shadow-sm transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur rounded-full hover:bg-white shadow-sm transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white/50 backdrop-blur px-3 py-2 rounded-full">
                      {mediaList.map((_, idx) => (
                        <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-[#323338] w-4" : "bg-[#323338]/30 w-2"}`} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[#a1a1b5] text-[15px]">미디어 없음</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── 기본 포맷 ────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#323338]/40 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-[#323338] rounded-full hover:bg-white hover:scale-110 shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Media */}
        <div className="relative w-full md:w-[55%] lg:w-[60%] bg-[#f5f6f8] flex-shrink-0 flex items-center justify-center min-h-[40vh] md:min-h-0 border-r border-gray-100 overflow-hidden">
          {mediaList.length > 0 ? (
            <>
              <div className="w-full h-full absolute inset-0">
                <MediaPlayer url={mediaList[currentIndex]} alt={`${project.title} - ${currentIndex + 1}`} key={mediaList[currentIndex]} />
              </div>
              {mediaList.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-[#323338] rounded-full hover:bg-white shadow-sm hover:scale-110 transition-all">
                    <ChevronLeft className="w-5 h-5 pr-0.5" />
                  </button>
                  <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-[#323338] rounded-full hover:bg-white shadow-sm hover:scale-110 transition-all">
                    <ChevronRight className="w-5 h-5 pl-0.5" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/50 backdrop-blur px-3 py-2 rounded-full">
                    {mediaList.map((_, idx) => (
                      <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-[#323338] w-4" : "bg-[#323338]/30"}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-[#a1a1b5] text-[15px] font-medium">미디어 없음</div>
          )}
        </div>

        {/* Right: Text */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="p-8 pb-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.tags.map((tag, idx) => (
                <span key={idx} className={`px-3 py-1 text-[12px] font-medium uppercase tracking-wider rounded-sm ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-[28px] font-semibold text-[#323338] mb-6 leading-tight tracking-tight">{project.title}</h2>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[14px] font-medium text-[#676879]">
              <div className="flex items-center gap-2.5 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f6f8] group-hover:bg-[#0073ea] group-hover:text-white text-[#323338] transition-colors duration-300">
                  <CalendarRange className="w-[15px] h-[15px]" />
                </div>
                <span>{project.period}</span>
              </div>
              <div className="flex items-center gap-2.5 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f6f8] group-hover:bg-[#00c875] group-hover:text-white text-[#323338] transition-colors duration-300">
                  <Building2 className="w-[15px] h-[15px]" />
                </div>
                <span>{project.institution || "—"}</span>
              </div>
            </div>
          </div>

          <div className="p-8 overflow-y-auto flex-1 text-[#323338] leading-relaxed [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent]">
            <p className="text-[16px] text-[#676879] mb-10 border-l-[3px] border-[#0073ea] pl-5 py-1 font-medium leading-loose">
              {project.description}
            </p>
            {project.details && project.details.length > 0 ? (
              <div className="space-y-10">
                {project.details.map((detail, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <h3 className="text-[18px] font-semibold text-[#323338]">{detail.subtitle}</h3>
                    <p className="text-[15px] text-[#676879] whitespace-pre-line leading-loose">{detail.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[#a1a1b5] py-12 text-[15px] font-medium border-2 border-dashed border-[#e6e9ef] rounded-xl">
                상세 설명이 등록되지 않았습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
