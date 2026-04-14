import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Experience } from "@/data/experiences";

interface ExperienceSectionProps {
  experiences: Experience[];
  isAdmin?: boolean;
  onAdd?: () => void;
  onEdit?: (exp: Experience) => void;
  onDelete?: (exp: Experience) => void;
}

export function ExperienceSection({ experiences, isAdmin, onAdd, onEdit, onDelete }: ExperienceSectionProps) {
  if (experiences.length === 0 && !isAdmin) return null;

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-semibold text-[#323338]">경력</h2>
        {isAdmin && (
          <button
            onClick={onAdd}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] hover:text-[#0073ea] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {experiences.length === 0 ? (
        <p className="text-[14px] text-[#a1a1b5]">경력을 추가해주세요.</p>
      ) : (
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <div key={exp.id}>
              {i > 0 && <div className="border-t border-[#f5f6f8] my-4" />}
              <div className="flex gap-4 group">
                {/* Logo */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#f5f6f8] overflow-hidden border border-gray-100 flex items-center justify-center mt-0.5">
                  {exp.logoUrl ? (
                    <ImageWithFallback src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[18px] font-bold text-[#c5c9d6]">{exp.company.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#323338] leading-snug">{exp.title}</h3>
                  <p className="text-[14px] text-[#323338] mt-0.5">
                    {exp.company}
                    {exp.employmentType && <span className="text-[#676879]"> · {exp.employmentType}</span>}
                  </p>
                  <p className="text-[13px] text-[#676879] mt-0.5">
                    {exp.startDate} ~ {exp.isCurrent ? "현재" : exp.endDate}
                  </p>
                  {exp.locationType && (
                    <p className="text-[13px] text-[#676879]">{exp.locationType}</p>
                  )}
                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {exp.skills.map((skill, si) => (
                        <span key={si} className="flex items-center gap-1 text-[12px] text-[#676879] font-medium">
                          <span className="text-[#0073ea]">⊙</span> {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin buttons */}
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => onEdit?.(exp)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#a1a1b5] hover:text-[#0073ea] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(exp)}
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
