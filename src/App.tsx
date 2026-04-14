import { useState, useEffect, useCallback } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { NotionCard } from "@/components/NotionCard";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { ExperienceFormModal } from "@/components/ExperienceFormModal";
import { EducationFormModal } from "@/components/EducationFormModal";
import { Footer } from "@/components/Footer";
import { fetchProjects, createProject, updateProject, deleteProject } from "@/data/projects";
import type { ProjectFormValues } from "@/data/projects";
import { fetchProfile, updateProfile } from "@/data/profile";
import type { ProfileUpdateData } from "@/data/profile";
import {
  fetchExperiences, createExperience, updateExperience, deleteExperience,
} from "@/data/experiences";
import type { Experience, ExperienceFormValues } from "@/data/experiences";
import {
  fetchEducation, createEducation, updateEducation, deleteEducation,
} from "@/data/education";
import type { Education, EducationFormValues } from "@/data/education";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectData } from "@/types";
import type { ProfileData } from "@/data/profile";

const SORT_OPTIONS = ["최신순", "오래된순", "가나다순"] as const;

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 데이터
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 편집 모달
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileEditTab, setProfileEditTab] = useState<"info" | "about" | "image">("info");

  // 경력 모달
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deleteExpConfirm, setDeleteExpConfirm] = useState<Experience | null>(null);

  // 학력 모달
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [deleteEduConfirm, setDeleteEduConfirm] = useState<Education | null>(null);

  // 프로젝트 CRUD 모달
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProjectData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 데이터 로드
  const loadProjects = useCallback(() => {
    setLoadingProjects(true);
    fetchProjects()
      .then(setProjects)
      .catch(() => setError("프로젝트를 불러오지 못했습니다."))
      .finally(() => setLoadingProjects(false));
  }, []);

  const loadProfile = useCallback(() => {
    fetchProfile().then(setProfile).catch(() => {});
  }, []);

  const loadExperiences = useCallback((profileId: string) => {
    fetchExperiences(profileId).then(setExperiences).catch(() => {});
  }, []);

  const loadEducation = useCallback((profileId: string) => {
    fetchEducation(profileId).then(setEducation).catch(() => {});
  }, []);

  useEffect(() => {
    loadProjects();
    fetchProfile()
      .then((p) => {
        setProfile(p);
        if (p?.id) {
          loadExperiences(p.id);
          loadEducation(p.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [loadProjects, loadExperiences, loadEducation]);

  // 프로필 저장
  const handleProfileSave = async (data: ProfileUpdateData) => {
    if (!profile?.id) return;
    await updateProfile(profile.id, data);
    loadProfile();
  };

  // 경력 저장
  const handleExpSave = async (data: ExperienceFormValues) => {
    if (!profile?.id) return;
    if (editingExp) {
      await updateExperience(editingExp.id, data);
    } else {
      await createExperience(profile.id, data, experiences.length);
    }
    loadExperiences(profile.id);
  };

  const handleExpDelete = async (exp: Experience) => {
    await deleteExperience(exp.id);
    setDeleteExpConfirm(null);
    if (profile?.id) loadExperiences(profile.id);
  };

  // 학력 저장
  const handleEduSave = async (data: EducationFormValues) => {
    if (!profile?.id) return;
    if (editingEdu) {
      await updateEducation(editingEdu.id, data);
    } else {
      await createEducation(profile.id, data, education.length);
    }
    loadEducation(profile.id);
  };

  const handleEduDelete = async (edu: Education) => {
    await deleteEducation(edu.id);
    setDeleteEduConfirm(null);
    if (profile?.id) loadEducation(profile.id);
  };

  // 프로젝트 저장/삭제
  const handleProjectSave = async (data: ProjectFormValues) => {
    if (editingProject?.id) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
    loadProjects();
  };

  const handleProjectDelete = async (project: ProjectData) => {
    if (!project.id) return;
    setDeleteLoading(true);
    try {
      await deleteProject(project.id);
      setDeleteConfirm(null);
      loadProjects();
    } finally {
      setDeleteLoading(false);
    }
  };

  const {
    allTags, activeTag, sortOption, visibleProjects, filteredProjects,
    showNoMoreMsg, handleTagChange, handleSortChange, loadMore,
  } = useProjects(projects);

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans selection:bg-[#0073ea] selection:text-white">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-4">

        {/* 프로필 */}
        <ProfileHeader
          isAdmin={isAdmin}
          profile={profile}
          loading={loadingProfile}
          onEditCover={() => { setProfileEditTab("image"); setProfileEditOpen(true); }}
          onEditProfileImage={() => { setProfileEditTab("image"); setProfileEditOpen(true); }}
          onEditProfile={() => { setProfileEditTab("info"); setProfileEditOpen(true); }}
        />

        {/* 소개 */}
        <AboutSection
          about={profile?.about ?? null}
          isAdmin={isAdmin}
          onEdit={() => { setProfileEditTab("about"); setProfileEditOpen(true); }}
        />

        {/* 경력 */}
        <ExperienceSection
          experiences={experiences}
          isAdmin={isAdmin}
          onAdd={() => { setEditingExp(null); setExpModalOpen(true); }}
          onEdit={(exp) => { setEditingExp(exp); setExpModalOpen(true); }}
          onDelete={(exp) => setDeleteExpConfirm(exp)}
        />

        {/* 학력 */}
        <EducationSection
          education={education}
          isAdmin={isAdmin}
          onAdd={() => { setEditingEdu(null); setEduModalOpen(true); }}
          onEdit={(edu) => { setEditingEdu(edu); setEduModalOpen(true); }}
          onDelete={(edu) => setDeleteEduConfirm(edu)}
        />

        {/* 활동 */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] px-8 py-6">
          <div className="flex flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[20px] font-semibold text-[#323338] flex items-center gap-3">
                활동
                {isAdmin && (
                  <button
                    onClick={() => { setEditingProject(null); setFormModalOpen(true); }}
                    className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#f5f6f8] text-[#676879] hover:bg-[#e6e9ef] hover:text-[#0073ea] transition-all duration-200"
                    title="추가"
                  >
                    <Plus className="w-[16px] h-[16px]" strokeWidth={2.5} />
                  </button>
                )}
              </h2>
            </div>
          </div>

          {/* Sort & Tag Filters */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="flex items-center gap-3 mr-1 relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-1 text-[14px] font-medium text-[#323338] hover:text-[#0073ea] transition-colors"
              >
                {sortOption}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortDropdownOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#d0d4e4] py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => { handleSortChange(option); setIsSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors ${
                          sortOption === option ? "bg-[#e6e9ef] text-[#0073ea]" : "text-[#323338] hover:bg-[#f5f6f8]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="w-[1px] h-3.5 bg-[#d0d4e4] ml-1" />
            </div>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${
                  activeTag === tag
                    ? "bg-[#0073ea] text-white shadow-[0_4px_12px_rgba(0,115,234,0.3)] scale-[1.02]"
                    : "bg-[#f5f6f8] text-[#676879] hover:bg-[#e6e9ef] hover:text-[#323338]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          {error ? (
            <div className="text-center py-20 text-[#676879] text-[15px]">{error}</div>
          ) : loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-[#f5f6f8]" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-[#f5f6f8] rounded w-1/3" />
                    <div className="h-5 bg-[#f5f6f8] rounded w-3/4" />
                    <div className="h-3 bg-[#f5f6f8] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <NotionCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  imageUrl={project.imageUrl}
                  tags={project.tags}
                  period={project.period}
                  isAdmin={isAdmin}
                  onClick={() => setSelectedProject(project)}
                  onEdit={() => { setEditingProject(project); setFormModalOpen(true); }}
                  onDelete={() => setDeleteConfirm(project)}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {!loadingProjects && !error && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                onClick={loadMore}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#f5f6f8] rounded-full text-[15px] font-medium text-[#323338] hover:bg-[#e6e9ef] transition-all duration-200"
              >
                더보기
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${visibleProjects.length >= filteredProjects.length ? "rotate-180" : ""}`} />
              </button>
              {showNoMoreMsg && (
                <p className="text-[14px] font-medium text-[#676879] animate-in fade-in slide-in-from-top-2 duration-300">
                  더 이상 표시할 항목이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer isAdmin={isAdmin} onLogin={() => setIsAdmin(true)} onLogout={() => setIsAdmin(false)} />

      {/* 모달들 */}
      <ProjectDetailModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />

      <ProfileEditModal
        isOpen={profileEditOpen}
        profile={profile}
        initialTab={profileEditTab}
        onClose={() => setProfileEditOpen(false)}
        onSave={handleProfileSave}
      />

      <ExperienceFormModal
        isOpen={expModalOpen}
        experience={editingExp}
        onClose={() => { setExpModalOpen(false); setEditingExp(null); }}
        onSave={handleExpSave}
      />

      <EducationFormModal
        isOpen={eduModalOpen}
        education={editingEdu}
        onClose={() => { setEduModalOpen(false); setEditingEdu(null); }}
        onSave={handleEduSave}
      />

      <ProjectFormModal
        isOpen={formModalOpen}
        project={editingProject}
        onClose={() => { setFormModalOpen(false); setEditingProject(null); }}
        onSave={handleProjectSave}
      />

      {/* 경력 삭제 확인 */}
      {deleteExpConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#323338]/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setDeleteExpConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[20px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-8">
            <h3 className="text-[18px] font-semibold text-[#323338] mb-2">경력 삭제</h3>
            <p className="text-[14px] text-[#676879] mb-6 leading-relaxed">
              <span className="font-semibold text-[#323338]">"{deleteExpConfirm.title}"</span> 경력을 삭제할까요?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteExpConfirm(null)} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors">취소</button>
              <button onClick={() => handleExpDelete(deleteExpConfirm)} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 학력 삭제 확인 */}
      {deleteEduConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#323338]/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setDeleteEduConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[20px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-8">
            <h3 className="text-[18px] font-semibold text-[#323338] mb-2">학력 삭제</h3>
            <p className="text-[14px] text-[#676879] mb-6 leading-relaxed">
              <span className="font-semibold text-[#323338]">"{deleteEduConfirm.schoolName}"</span> 학력을 삭제할까요?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteEduConfirm(null)} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors">취소</button>
              <button onClick={() => handleEduDelete(deleteEduConfirm)} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 프로젝트 삭제 확인 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#323338]/40 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-[20px] shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-8">
            <h3 className="text-[18px] font-semibold text-[#323338] mb-2">프로젝트 삭제</h3>
            <p className="text-[14px] text-[#676879] mb-6 leading-relaxed">
              <span className="font-semibold text-[#323338]">"{deleteConfirm.title}"</span>을(를) 삭제하면<br />복구할 수 없습니다. 계속하시겠어요?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-[#676879] bg-[#f5f6f8] hover:bg-[#e6e9ef] transition-colors">취소</button>
              <button onClick={() => handleProjectDelete(deleteConfirm)} disabled={deleteLoading} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-colors">
                {deleteLoading ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
