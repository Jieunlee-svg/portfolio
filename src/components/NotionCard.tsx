import { CalendarRange, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getTagColor } from "@/constants/colors";

interface NotionCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  period?: string;
  onClick?: () => void;
}

export function NotionCard({ title, description, imageUrl, tags, period, onClick }: NotionCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white rounded-[24px] border border-gray-100 hover:border-transparent hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer h-full relative"
    >
      {/* Image */}
      {imageUrl ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50 relative">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-[#f5f6f8] flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-[#e6e9ef] transition-colors duration-500">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon className="w-7 h-7 text-[#c5c9d6] group-hover:text-[#0073ea] transition-colors duration-500" />
          </div>
          <span className="text-[#a1a1b5] font-medium text-sm tracking-wide group-hover:text-[#676879] transition-colors duration-500">
            No Image
          </span>
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-sm text-[11px] font-medium uppercase tracking-wider ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[#323338] text-xl mb-3 line-clamp-2 leading-snug group-hover:text-[#0073ea] transition-colors">
          {title}
        </h3>

        <div className="flex-grow" />

        {/* Period */}
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#a1a1b5] mb-3 group-hover:text-[#323338] transition-colors duration-300">
          <div className="w-5 h-5 rounded-full bg-[#f5f6f8] group-hover:bg-[#0073ea] group-hover:text-white flex items-center justify-center transition-colors duration-300">
            <CalendarRange className="w-3 h-3" />
          </div>
          <span>{period || "진행 기간 미상"}</span>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#676879] line-clamp-2 mb-6 leading-relaxed">
          {description}
        </p>

        {/* 자세히 보기 */}
        <button className="flex items-center justify-between w-full pt-4 border-t border-[#f5f6f8] text-[14px] font-medium text-[#323338] group-hover:text-[#0073ea] transition-colors">
          <span>자세히 보기</span>
          <span className="w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:border-[#0073ea] group-hover:bg-[#0073ea] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
