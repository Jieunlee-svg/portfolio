import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Education, EducationFormValues } from "@/data/education";

interface EducationFormModalProps {
  isOpen: boolean;
  education?: Education | null;
  onClose: () => void;
  onSave: (data: EducationFormValues) => Promise<void>;
}

const EMPTY: EducationFormValues = {
  schoolName: "",
  logoUrl: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
};

export function EducationFormModal({ isOpen, education, onClose, onSave }: EducationFormModalProps) {
  const isEdit = !!education;
  const [form, setForm] = useState<EducationFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (education) {
        setForm({
          schoolName: education.schoolName,
          logoUrl: education.logoUrl ?? "",
          degree: education.degree ?? "",
          field: education.field ?? "",
          startYear: education.startYear ?? "",
          endYear: education.endYear ?? "",
        });
      } else {
        setForm(EMPTY);
      }
      setError(null);
    }
  }, [isOpen, education]);

  if (!isOpen) return null;

  const set = (field: keyof EducationFormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.schoolName.trim()) { setError("학교명을 입력해주세요."); return; }
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
          <h2 className="text-[20px] font-semibold text-[#323338]">{isEdit ? "학력 수정" : "학력 추가"}</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4 [scrollbar-width:thin]">
          <div>
            <label className={labelClass}>학교명 <span className="text-red-400">*</span></label>
            <input type="text" value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} placeholder="예) 한국외국어대학교" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>학교 로고 URL</label>
            <input type="text" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>학위</label>
            <input type="text" value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="예) 학사, 석사, 박사" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>전공</label>
            <input type="text" value={form.field} onChange={(e) => set("field", e.target.value)} placeholder="예) Public Administration" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>입학년도</label>
              <input type="text" value={form.startYear} onChange={(e) => set("startYear", e.target.value)} placeholder="예) 2014" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>졸업년도</label>
              <input type="text" value={form.endYear} onChange={(e) => set("endYear", e.target.value)} placeholder="예) 2018" className={inputClass} />
            </div>
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
