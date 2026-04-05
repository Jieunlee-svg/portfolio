import { useState, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { NotionCard } from "@/components/NotionCard";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { Footer } from "@/components/Footer";
import { fetchProjects } from "@/data/projects";
import { fetchProfile } from "@/data/profile";
import { useProjects } from "@/hooks/useProjects";
import type { ProjectData } from "@/types";
import type { ProfileData } from "@/data/profile";

const SORT_OPTIONS = ["최신순", "오래된순", "가나다순"] as const;

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setError("프로젝트를 불러오지 못했습니다."))
      .finally(() => setLoadingProjects(false));

    fetchProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const {
    allTags,
    activeTag,
    sortOption,
    visibleProjects,
    filteredProjects,
    showNoMoreMsg,
    handleTagChange,
    handleSortChange,
    loadMore,
  } = useProjects(projects);

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans selection:bg-[#0073ea] selection:text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-10 mt-4">
          <ProfileHeader isAdmin={isAdmin} profile={profile} loading={loadingProfile} />
        </div>

        {/* Section Header */}
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-semibold text-[#323338] tracking-tight flex items-center gap-3">
                프로젝트 및 작업물
                {isAdmin && (
                  <button
                    className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-white text-[#323338] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:text-[#0073ea] transition-all duration-200"
                    title="추가"
                    aria-label="추가"
                  >
                    <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                )}
              </h2>
              <p className="text-[15px] font-medium text-[#676879] mt-1.5">
                최근 진행한 프로젝트와 포트폴리오를 확인해보세요
              </p>
            </div>
          </div>

          {/* Sort & Tag Filters */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
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
                        onClick={() => {
                          handleSortChange(option);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors ${
                          sortOption === option
                            ? "bg-[#e6e9ef] text-[#0073ea]"
                            : "text-[#323338] hover:bg-[#f5f6f8]"
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
                    : "bg-white text-[#676879] border border-[#d0d4e4] hover:bg-[#e6e9ef] hover:text-[#323338] hover:border-transparent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
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
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loadingProjects && !error && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <button
              onClick={loadMore}
              className="flex items-center gap-2 px-8 py-3.5 bg-white border border-[#d0d4e4] rounded-full text-[15px] font-medium text-[#323338] hover:bg-[#e6e9ef] hover:border-transparent transition-all duration-200 shadow-sm hover:shadow"
            >
              더보기
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  visibleProjects.length >= filteredProjects.length ? "rotate-180" : ""
                }`}
              />
            </button>
            {showNoMoreMsg && (
              <p className="text-[14px] font-medium text-[#676879] animate-in fade-in slide-in-from-top-2 duration-300">
                더 이상 표시할 항목이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>

      <Footer
        isAdmin={isAdmin}
        onLogin={() => setIsAdmin(true)}
        onLogout={() => setIsAdmin(false)}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
