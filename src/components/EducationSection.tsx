import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Education } from "@/data/education";

interface EducationSectionProps {
  education: Education[];
  isAdmin?: boolean;
  onAdd?: () => void;
  onEdit?: (edu: Education) => void;
  onDelete?: (edu: Education) => void;
}

export function EducationSection({ education, isAdmin, onAdd, onEdit, onDelete }: EducationSectionProps) {
  if (education.length === 0 && !isAdmin) return null;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-semibold text-[#323338]">학력</h2>
        {isAdmin && (
          <button
            onClick={onAdd}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] hover:text-[#0073ea] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {education.length === 0 ? (
        <p className="text-[14px] text-[#a1a1b5]">학력을 추가해주세요.</p>
      ) : (
        <div className="space-y-0">
          {education.map((edu, i) => (
            <div key={edu.id}>
              {i > 0 && <div className="border-t border-[#f5f6f8] my-4" />}
              <div className="flex gap-4 group">
                {/* Logo */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#f5f6f8] overflow-hidden border border-gray-100 flex items-center justify-center mt-0.5">
                  {edu.logoUrl ? (
                    <ImageWithFallback src={edu.logoUrl} alt={edu.schoolName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[18px] font-bold text-[#c5c9d6]">{edu.schoolName.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#323338] leading-snug">{edu.schoolName}</h3>
                  {(edu.degree || edu.field) && (
                    <p className="text-[14px] text-[#676879] mt-0.5">
                      {[edu.degree, edu.field].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {(edu.startYear || edu.endYear) && (
                    <p className="text-[13px] text-[#676879] mt-0.5">
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" ~ ")}
                    </p>
                  )}
                </div>

                {/* Admin buttons */}
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => onEdit?.(edu)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#a1a1b5] hover:text-[#0073ea] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(edu)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-[#a1a1b5] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
