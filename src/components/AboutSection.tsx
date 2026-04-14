import { Pencil } from "lucide-react";

interface AboutSectionProps {
  about: string | null;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export function AboutSection({ about, isAdmin, onEdit }: AboutSectionProps) {
  if (!about && !isAdmin) return null;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-semibold text-[#323338]">소개</h2>
        {isAdmin && (
          <button
            onClick={onEdit}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] hover:text-[#323338] transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      {about ? (
        <p className="text-[15px] text-[#676879] leading-relaxed whitespace-pre-line">{about}</p>
      ) : (
        <p className="text-[14px] text-[#a1a1b5]">소개 내용을 추가해주세요.</p>
      )}
    </div>
  );
}
