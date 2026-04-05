import { useState } from "react";
import { X, ChevronLeft, ChevronRight, CalendarRange, Building2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface ProjectDetail {
  subtitle: string;
  content: string;
}

export interface ProjectData {
  title: string;
  description: string;
  imageUrl?: string;
  images?: string[];
  tags: string[];
  period: string;
  institution?: string;
  details?: ProjectDetail[];
}

interface ProjectDetailModalProps {
  project: ProjectData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Monday.com style vivid colors for tags
const MONDAY_COLORS = [
  "bg-[#e2445c] text-white", // Red
  "bg-[#00c875] text-white", // Green
  "bg-[#fdab3d] text-white", // Orange
  "bg-[#579bfc] text-white", // Light Blue
  "bg-[#a25ddc] text-white", // Purple
  "bg-[#0086c0] text-white", // Dark Blue
  "bg-[#eec300] text-[#333333]", // Yellow
  "bg-[#ff642e] text-white", // Bright Orange
  "bg-[#ff158a] text-white", // Pink
  "bg-[#7f5347] text-white", // Brown
];

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % MONDAY_COLORS.length;
  return MONDAY_COLORS[index];
};

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !project) return null;

  const images = project.images && project.images.length > 0 
    ? project.images 
    : (project.imageUrl ? [project.imageUrl] : []);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#323338]/40 backdrop-blur-sm transition-opacity">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[80vh] transform transition-all duration-300">
        
        {/* Close Button (Mobile & Desktop) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-[#323338] rounded-full hover:bg-white hover:scale-110 shadow-sm transition-all md:top-4 md:right-4"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Carousel (Instagram Style) */}
        <div className="relative w-full md:w-[55%] lg:w-[60%] bg-[#f5f6f8] flex-shrink-0 flex items-center justify-center min-h-[40vh] md:min-h-0 border-r border-gray-100">
          {images.length > 0 ? (
            <>
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={`${project.title} - image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-[#323338] rounded-full hover:bg-white shadow-sm hover:scale-110 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 pr-0.5" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-[#323338] rounded-full hover:bg-white shadow-sm hover:scale-110 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 pl-0.5" />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/50 backdrop-blur px-3 py-2 rounded-full">
                    {images.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex ? "bg-[#323338] w-4" : "bg-[#323338]/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-[#a1a1b5] text-[15px] font-medium">이미지 없음</div>
          )}
        </div>

        {/* Right: Text Details */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Header */}
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
                <span className="tracking-tight group-hover:text-[#323338] transition-colors">{project.period}</span>
              </div>
              
              {(project.institution || "소속 기관 없음") && (
                <div className="flex items-center gap-2.5 group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f5f6f8] group-hover:bg-[#00c875] group-hover:text-white text-[#323338] transition-colors duration-300">
                    <Building2 className="w-[15px] h-[15px]" />
                  </div>
                  <span className="tracking-tight group-hover:text-[#323338] transition-colors">{project.institution || "Tech Corp"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
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
