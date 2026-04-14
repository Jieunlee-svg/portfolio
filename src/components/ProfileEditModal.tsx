import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { ProfileData, ProfileUpdateData, CompanyEntry } from "@/data/profile";

interface ProfileEditModalProps {
  isOpen: boolean;
  profile: ProfileData | null;
  initialTab?: "image" | "info";
  onClose: () => void;
  onSave: (data: ProfileUpdateData) => Promise<void>;
}

export function ProfileEditModal({ isOpen, profile, initialTab = "info", onClose, onSave }: ProfileEditModalProps) {
  const [tab, setTab] = useState<"image" | "info">(initialTab);
  const [form, setForm] = useState<ProfileUpdateData>({
    name: "",
    role: "",
    location: "",
    coverImage: "",
    profileImage: "",
    companies: [],
    universityName: "",
    universityLogoUrl: "",
    universityUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        name: profile.name ?? "",
        role: profile.role ?? "",
        location: profile.location ?? "",
        coverImage: profile.coverImage ?? "",
        profileImage: profile.profileImage ?? "",
        companies: profile.companies ?? [],
        universityName: profile.university?.name ?? "",
        universityLogoUrl: profile.university?.logoUrl ?? "",
        universityUrl: profile.university?.url ?? "",
      });
      setTab(initialTab);
      setError(null);
    }
  }, [isOpen, profile, initialTab]);

  if (!isOpen) return null;

  const handleField = (field: keyof Omit<ProfileUpdateData, "companies">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addCompany = () =>
    setForm((prev) => ({ ...prev, companies: [...prev.companies, { name: "", logoUrl: "" }] }));

  const updateCompany = (index: number, field: keyof CompanyEntry, value: string) =>
    setForm((prev) => {
      const companies = [...prev.companies];
      companies[index] = { ...companies[index], [field]: value };
      return { ...prev, companies };
    });

  const removeCompany = (index: number) =>
    setForm((prev) => ({ ...prev, companies: prev.companies.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("이름을 입력해주세요."); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        companies: form.companies.filter((c) => c.name.trim()),
      });
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
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[20px] font-semibold text-[#323338]">프로필 편집</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f6f8] text-[#676879] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-gray-100 flex-shrink-0">
          {(["info", "image"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3.5 text-[14px] font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-[#0073ea] text-[#0073ea]"
                  : "border-transparent text-[#676879] hover:text-[#323338]"
              }`}
            >
              {t === "info" ? "기본 정보" : "이미지"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4 [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.300)_transparent]">
          {tab === "info" && (
            <>
              <div>
                <label className={labelClass}>이름 <span className="text-red-400">*</span></label>
                <input type="text" value={form.name} onChange={(e) => handleField("name", e.target.value)} placeholder="이름" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>직함 / 역할</label>
                <input type="text" value={form.role} onChange={(e) => handleField("role", e.target.value)} placeholder="예) Product Designer" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>위치</label>
                <input type="text" value={form.location} onChange={(e) => handleField("location", e.target.value)} placeholder="예) 서울, 대한민국" className={inputClass} />
              </div>

              {/* 회사 */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider">회사</p>
                  <button
                    onClick={addCompany}
                    className="flex items-center gap-1 text-[13px] font-medium text-[#0073ea] hover:text-[#0060c0] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> 추가
                  </button>
                </div>
                {form.companies.length === 0 && (
                  <p className="text-[13px] text-[#a1a1b5]">추가 버튼을 눌러 회사를 등록하세요.</p>
                )}
                <div className="space-y-3">
                  {form.companies.map((company, i) => (
                    <div key={i} className="relative bg-[#f5f6f8] rounded-xl p-4 space-y-2">
                      <button
                        onClick={() => removeCompany(i)}
                        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-[#a1a1b5] hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className={labelClass}>회사명</label>
                        <input
                          type="text"
                          value={company.name}
                          onChange={(e) => updateCompany(i, "name", e.target.value)}
                          placeholder="예) Toss, 카카오"
                          className="w-full px-3 py-2 rounded-lg border border-[#d0d4e4] bg-white text-[13px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] transition-all"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>회사 로고 URL</label>
                        <input
                          type="text"
                          value={company.logoUrl}
                          onChange={(e) => updateCompany(i, "logoUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-[#d0d4e4] bg-white text-[13px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] transition-all"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>링크 URL</label>
                        <input
                          type="text"
                          value={company.url}
                          onChange={(e) => updateCompany(i, "url", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-[#d0d4e4] bg-white text-[13px] text-[#323338] placeholder-[#a1a1b5] focus:outline-none focus:border-[#0073ea] transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 학교 */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[13px] font-semibold text-[#a1a1b5] uppercase tracking-wider mb-4">학교</p>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>학교명</label>
                    <input type="text" value={form.universityName} onChange={(e) => handleField("universityName", e.target.value)} placeholder="예) 서울대학교" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>학교 로고 URL</label>
                    <input type="text" value={form.universityLogoUrl} onChange={(e) => handleField("universityLogoUrl", e.target.value)} placeholder="https://..." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>링크 URL</label>
                    <input type="text" value={form.universityUrl} onChange={(e) => handleField("universityUrl", e.target.value)} placeholder="https://..." className={inputClass} />
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === "image" && (
            <>
              <div>
                <label className={labelClass}>커버 이미지 URL</label>
                <input type="text" value={form.coverImage} onChange={(e) => handleField("coverImage", e.target.value)} placeholder="https://..." className={inputClass} />
                {form.coverImage && (
                  <img src={form.coverImage} alt="커버 미리보기" className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-100" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>
              <div>
                <label className={labelClass}>프로필 이미지 URL</label>
                <input type="text" value={form.profileImage} onChange={(e) => handleField("profileImage", e.target.value)} placeholder="https://..." className={inputClass} />
                {form.profileImage && (
                  <img src={form.profileImage} alt="프로필 미리보기" className="mt-2 w-20 h-20 object-cover rounded-full border border-gray-100" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0 flex items-center justify-between">
          {error ? (
            <p className="text-[13px] text-red-500 font-medium">{error}</p>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors">
              취소
            </button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-[#0073ea] hover:bg-[#0060c0] disabled:opacity-60 transition-colors">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
