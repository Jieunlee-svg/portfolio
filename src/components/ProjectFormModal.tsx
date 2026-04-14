import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { ProjectData } from "@/types";
import type { ProjectFormValues } from "@/data/projects";

interface ProjectFormModalProps {
  isOpen: boolean;
  project?: ProjectData | null;
  onClose: () => void;
  onSave: (data: ProjectFormValues) => Promise<void>;
}

const EMPTY_FORM: ProjectFormValues = {
  title: "",
  description: "",
  period: "",
  institution: "",
  imageUrl: "",
  tags: [],
  details: [],
  images: [],
  modalType: "default",
};

function projectToForm(p: ProjectData): ProjectFormValues {
  return {
    title: p.title,
    description: p.description,
    period: p.period,
    institution: p.institution ?? "",
    imageUrl: p.imageUrl ?? "",
    tags: p.tags ?? [],
    details: p.details ?? [],
    images: p.images ?? [],
    modalType: p.modalType ?? "default",
  };
}

export function ProjectFormModal({ isOpen, project, onClose, onSave }: ProjectFormModalProps) {
  const isEdit = !!project;
  const [form, setForm] = useState<ProjectFormValues>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setForm(projectToForm(project));
        setTagInput(project.tags?.join(", ") ?? "");
      } else {
        setForm(EMPTY_FORM);
        setTagInput("");
      }
      setError(null);
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleField = (field: keyof ProjectFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagInputBlur = () => {
    const parsed = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, tags: parsed }));
  };

  // Details
  const addDetail = () =>
    setForm((prev) => ({ ...prev, details: [...prev.details, { subtitle: "", content: "" }] }));

  const updateDetail = (index: number, field: "subtitle" | "content", value: string) =>
    setForm((prev) => {
      const details = [...prev.details];
      details[index] = { ...details[index], [field]: value };
      return { ...prev, details };
    });

  const removeDetail = (index: number) =>
    setForm((prev) => ({ ...prev, details: prev.details.filter((_, i) => i !== index) }));

  // Images
  const addImage = () =>
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));

  const updateImage = (index: number, value: string) =>
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });

  const removeImage = (index: number) =>
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!form.description.trim()) { setError("설명을 입력해주세요."); return; }
    if (!form.period.trim()) { setError("기간을 입력해주세요."); return; }

    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const finalForm = {
      ...form,
      tags,
      images: form.images.filter((url) => url.trim()),
      details: form.details.filter((d) => d.subtitle.trim() || d.content.trim()),
    };

    setSaving(true);
    setError(null);
    try {
      await onSave(finalForm);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#323338]/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[20px] font-semibold text-[#323338]">
            {isEdit ? "프로젝트 수정" : "프로젝트 추가"}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent]">

          {/* 기본 정보 */}
          <section className="space-y-4">
            <h3 className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider">기본 정보</h3>

            <div>
              <label className="block text-[13px] font-medium text-[#323338] mb-1.5">제목 <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleField("title", e.target.value)}
                placeholder="프로젝트 이름"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#323338] mb-1.5">한 줄 설명 <span className="text-red-400">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => handleField("description", e.target.value)}
                placeholder="프로젝트를 한 줄로 소개해주세요"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#323338] mb-1.5">기간 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.period}
                  onChange={(e) => handleField("period", e.target.value)}
                  placeholder="예) 2024.01 ~ 2024.06"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#323338] mb-1.5">소속 / 기관</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={(e) => handleField("institution", e.target.value)}
                  placeholder="예) 회사명, 팀명"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#323338] mb-1.5">태그</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onBlur={handleTagInputBlur}
                placeholder="쉼표로 구분 — 예) UX, Product, Branding"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
              />
            </div>
          </section>

          {/* 모달 포맷 */}
          <section className="space-y-3">
            <h3 className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider">모달 포맷</h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "default", label: "기본", desc: "좌측 이미지 + 우측 텍스트" },
                { value: "image_focus", label: "이미지 집중", desc: "상단 정보 + 풀 이미지" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((prev) => ({ ...prev, modalType: opt.value }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    form.modalType === opt.value
                      ? "border-[#0073ea] bg-[#f0f7ff]"
                      : "border-[#d0d4e4] hover:border-[#a1a1b5]"
                  }`}
                >
                  <p className={`text-[14px] font-semibold ${form.modalType === opt.value ? "text-[#0073ea]" : "text-[#323338]"}`}>{opt.label}</p>
                  <p className="text-[12px] text-[#676879] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* 미디어 (이미지 / 동영상) */}
          <section className="space-y-4">
            <h3 className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider">미디어</h3>
            <p className="text-[12px] text-[#a1a1b5] -mt-2">이미지 URL 또는 YouTube·Vimeo·mp4 링크를 입력하세요.</p>

            <div>
              <label className="block text-[13px] font-medium text-[#323338] mb-1.5">대표 미디어 URL</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => handleField("imageUrl", e.target.value)}
                placeholder="https://... (이미지 또는 유튜브 링크)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#323338]">추가 미디어 (캐러셀)</label>
                <button
                  onClick={addImage}
                  className="flex items-center gap-1 text-[13px] font-medium text-[#0073ea] hover:text-[#0060c0] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </div>
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateImage(i, e.target.value)}
                    placeholder={`미디어 ${i + 1} URL`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#d0d4e4] text-[14px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] focus:ring-2 focus:ring-[#0073ea]/10 transition-all"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-[#a1a1b5] hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 상세 설명 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider">상세 설명</h3>
              <button
                onClick={addDetail}
                className="flex items-center gap-1 text-[13px] font-medium text-[#0073ea] hover:text-[#0060c0] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> 항목 추가
              </button>
            </div>
            {form.details.length === 0 && (
              <p className="text-[13px] text-[#a1a1b5]">항목 추가 버튼으로 소제목 + 내용을 등록하세요.</p>
            )}
            {form.details.map((detail, i) => (
              <div key={i} className="relative bg-[#f5f6f8] rounded-xl p-4 space-y-2">
                <button
                  onClick={() => removeDetail(i)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-[#a1a1b5] hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={detail.subtitle}
                  onChange={(e) => updateDetail(i, "subtitle", e.target.value)}
                  placeholder="소제목"
                  className="w-full px-3 py-2 rounded-lg border border-[#d0d4e4] bg-white text-[13px] font-medium text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] transition-all"
                />
                <textarea
                  value={detail.content}
                  onChange={(e) => updateDetail(i, "content", e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#d0d4e4] bg-white text-[13px] text-[#676879] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] transition-all resize-none"
                />
              </div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0 flex items-center justify-between gap-3">
          {error ? (
            <p className="text-[13px] text-red-500 font-medium">{error}</p>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#0073ea] hover:bg-[#0060c0] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "저장 중..." : isEdit ? "수정 완료" : "추가하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
