import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Experience, ExperienceFormValues } from "@/data/experiences";

interface ExperienceFormModalProps {
  isOpen: boolean;
  experience?: Experience | null;
  onClose: () => void;
  onSave: (data: ExperienceFormValues) => Promise<void>;
}

const EMPTY: ExperienceFormValues = {
  title: "",
  company: "",
  logoUrl: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  locationType: "",
  skills: "",
};

export function ExperienceFormModal({ isOpen, experience, onClose, onSave }: ExperienceFormModalProps) {
  const isEdit = !!experience;
  const [form, setForm] = useState<ExperienceFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (experience) {
        setForm({
          title: experience.title,
          company: experience.company,
          logoUrl: experience.logoUrl ?? "",
          employmentType: experience.employmentType ?? "",
          startDate: experience.startDate,
          endDate: experience.endDate ?? "",
          isCurrent: experience.isCurrent,
          locationType: experience.locationType ?? "",
          skills: experience.skills.join(", "),
        });
      } else {
        setForm(EMPTY);
      }
      setError(null);
    }
  }, [isOpen, experience]);

  if (!isOpen) return null;

  const set = (field: keyof ExperienceFormValues, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError("직함을 입력해주세요."); return; }
    if (!form.company.trim()) { setError("회사명을 입력해주세요."); return; }
    if (!form.startDate.trim()) { setError("시작일을 입력해주세요."); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all";
  const labelClass = "block text-[13px] font-medium text-[#323338] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#323338]/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[20px] font-semibold text-[#323338]">{isEdit ? "경력 수정" : "경력 추가"}</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4 [scrollbar-width:thin]">
          <div>
            <label className={labelClass}>직함 <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="예) 파트장, 선임매니저" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>회사명 <span className="text-red-400">*</span></label>
            <input type="text" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="예) 엠서클, bitsensing Inc." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>회사 로고 URL</label>
            <input type="text" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>고용 형태</label>
            <input type="text" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} placeholder="예) 정규직, 계약직, 프리랜서" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>시작일 <span className="text-red-400">*</span></label>
              <input type="text" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="예) 2023년 3월" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>종료일</label>
              <input type="text" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} placeholder="예) 2025년 5월" disabled={form.isCurrent} className={`${inputClass} ${form.isCurrent ? "opacity-40 cursor-not-allowed" : ""}`} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.isCurrent} onChange={(e) => set("isCurrent", e.target.checked)} className="w-4 h-4 accent-[#0073ea]" />
            <span className="text-[14px] text-[#323338] font-medium">현재 재직 중</span>
          </label>
          <div>
            <label className={labelClass}>근무 형태</label>
            <input type="text" value={form.locationType} onChange={(e) => set("locationType", e.target.value)} placeholder="예) 대면근무, 재택근무, 하이브리드" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>스킬 태그</label>
            <input type="text" value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="쉼표로 구분 — 예) 서비스기획, UX" className={inputClass} />
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0 flex items-center justify-between">
          {error ? <p className="text-[13px] text-red-500 font-medium">{error}</p> : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors">취소</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#0073ea] hover:bg-[#0060c0] disabled:opacity-60 transition-colors">
              {saving ? "저장 중..." : isEdit ? "수정 완료" : "추가하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
