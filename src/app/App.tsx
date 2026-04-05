import { useState } from "react";
import { ProfileHeader } from "./components/ProfileHeader";
import { NotionCard } from "./components/NotionCard";
import { ProjectDetailModal, ProjectData } from "./components/ProjectDetailModal";
import { ChevronDown, Plus } from "lucide-react";
import { Footer } from "./components/Footer";
import cardImage from "figma:asset/73daeab06616082f4ae518ac60071da2ca1604b9.png";

export default function App() {
  const [activeTag, setActiveTag] = useState("전체");
  const [isAdmin, setIsAdmin] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showNoMoreMsg, setShowNoMoreMsg] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [sortOption, setSortOption] = useState("최신순");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const projects: ProjectData[] = [
    {
      title: "모바일 앱 리디자인 프로젝트",
      description: "사용자 경험을 개선하기 위한 전체적인 UI/UX 리디자인 작업. 새로운 디자인 시스템 적용 및 사용성 테스트 진행.",
      imageUrl: cardImage,
      images: [
        cardImage,
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzUyODAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1607970669494-309137683be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwb24lMjBzY3JlZW58ZW58MXx8fHwxNzc1Mzc1Nzc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      tags: ["디자인", "모바일"],
      period: "2026.01 - 2026.03",
      institution: "한국 대학교",
      details: [
        {
          subtitle: "프로젝트 배경",
          content: "기존 모바일 앱의 복잡한 내비게이션 구조로 인해 사용자 이탈률이 증가하고 있었습니다. 이를 해결하기 위해 전면적인 UI 리디자인과 UX 개선이 필요했습니다."
        },
        {
          subtitle: "주요 개선 사항",
          content: "1. 주요 기능에 대한 접근성을 높이기 위해 하단 탭 바를 도입했습니다.\n2. 텍스트 가독성을 향상시키고, 브랜드 컬러를 활용한 일관성 있는 컴포넌트 라이브러리를 구축했습니다.\n3. 사용자 테스트 결과, 목표 도달 시간이 30% 단축되었습니다."
        }
      ]
    },
    {
      title: "디자인 시스템 구축",
      description: "회사 전체에서 사용할 수 있는 통합 디자인 시스템 개발. 컴포넌트 라이브러리와 가이드라인 문서화.",
      images: [
        "https://images.unsplash.com/photo-1690264320991-32706040bf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzUzNzU3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1758691736498-422201cc57da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBncmFwaHxlbnwxfHx8fDE3NzUzNzU3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      tags: ["시스템", "문서"],
      period: "2025.11 - 2026.02",
      institution: "대웅제약 디자인그룹",
      details: [
        {
          subtitle: "배경",
          content: "각 프로덕트 팀마다 다르게 적용되는 컴포넌트 때문에 디자인 부채가 증가하고 있었습니다. 중앙화된 디자인 시스템 도입을 결정했습니다."
        },
        {
          subtitle: "성과",
          content: "피그마 변수를 도입하여 테마 및 반응형 대응을 자동화했습니다.\n디자인-개발 핸드오프 리소스가 평균 40% 절감되었습니다."
        }
      ]
    },
    {
      title: "사용자 리서치 보고서",
      description: "신규 서비스 기획을 위한 사용자 인터뷰 �� 설문조사 결과 분석. 페르소나 및 사용자 여정 지도 작성.",
      tags: ["리서치", "분석"],
      period: "2025.12 - 2026.01"
    },
    {
      title: "프로토타입 개발",
      description: "새로운 기능에 대한 인터랙티브 프로토타입 제작. 사용성 테스트를 통한 개선 사항 도출.",
      imageUrl: cardImage,
      tags: ["프로토타입", "테스트"],
      period: "2025.10 - 2025.12"
    },
    {
      title: "아이콘 세트 디자인",
      description: "서비스 전반에 사용될 커스텀 아이콘 세트 디자인. 다양한 크기와 스타일 버전 제작.",
      tags: ["그래픽", "아이콘"],
      period: "2025.09 - 2025.11"
    },
    {
      title: "브랜드 가이드라인",
      description: "브랜드 아이덴티티 정립 및 비주얼 가이드라인 문서 작성. 로고, 컬러, 타이포그래피 규정.",
      tags: ["브랜딩", "가이드"],
      period: "2025.07 - 2025.10"
    },
    {
      title: "웹사이트 리뉴얼",
      description: "기업 공식 웹사이트 전면 개편. 접근성 강화 및 반응형 웹 디자인 적용.",
      imageUrl: cardImage,
      tags: ["디자인", "웹"],
      period: "2025.05 - 2025.09"
    },
    {
      title: "사내 어드민 대시보드",
      description: "내부 직원용 데이터 관리 대시보드 설계. 데이터 시각화 및 사용성 개선.",
      tags: ["시스템", "대시보드"],
      period: "2025.04 - 2025.08"
    },
    {
      title: "온보딩 프로세스 기획",
      description: "신규 가입 유저를 위한 온보딩 흐름 개선. 이탈률 감소 및 전환율 상승 기여.",
      tags: ["리서치", "기획"],
      period: "2025.03 - 2025.07"
    },
    {
      title: "소셜 미디어 콘텐츠 템플릿",
      description: "마케팅팀을 위한 일관된 소셜 미디어 이미지 템플릿 세트 제작.",
      imageUrl: cardImage,
      tags: ["그래픽", "마케팅"],
      period: "2025.02 - 2025.06"
    },
    {
      title: "A/B 테스트 결과 분석",
      description: "메인 페이지 CTA 버튼 디자인 변경에 따른 A/B 테스트 진행 및 결과 리포팅.",
      tags: ["분석", "테스트"],
      period: "2025.01 - 2025.05"
    },
    {
      title: "오프라인 행사 포스터",
      description: "연말 컨퍼런스 오프라인 홍보용 포스터 및 배너 디자인.",
      tags: ["그래픽", "브랜딩"],
      period: "2024.12 - 2025.04"
    }
  ];

  const allTags = ["전체", ...Array.from(new Set(projects.flatMap(p => p.tags)))].slice(0, 10);

  const filteredProjects = (activeTag === "전체"
    ? projects
    : projects.filter(p => p.tags.includes(activeTag)))
    .sort((a, b) => {
      if (sortOption === "가나다순") return a.title.localeCompare(b.title);
      if (sortOption === "오래된순") return a.period.localeCompare(b.period);
      return b.period.localeCompare(a.period); // 최신순 (기본)
    });

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans selection:bg-[#0073ea] selection:text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Profile Header */}
        <div className="mb-10 mt-4">
          <ProfileHeader isAdmin={isAdmin} />
        </div>

        {/* Section Title & Filtering */}
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
          
          {/* Sort & Chip Tags for Filtering */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6">
            <div className="flex items-center gap-3 mr-1 relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-1 text-[14px] font-medium text-[#323338] hover:text-[#0073ea] transition-colors" 
                title="정렬 기준"
              >
                {sortOption} <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsSortDropdownOpen(false)} 
                  />
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#d0d4e4] py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {["최신순", "오래된순", "가나다순"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setIsSortDropdownOpen(false);
                          setVisibleCount(6); // Reset visible count when sorting
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
              <div className="w-[1px] h-3.5 bg-[#d0d4e4] ml-1"></div>
            </div>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setActiveTag(tag);
                  setVisibleCount(6); // Reset visible count on tag change
                  setShowNoMoreMsg(false); // Reset the message state
                }}
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

        {/* Notion-style Card Grid */}
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

        {/* Load More Button */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              if (visibleCount >= filteredProjects.length) {
                setShowNoMoreMsg(true);
              } else {
                setVisibleCount((prev) => prev + 6);
                setShowNoMoreMsg(false);
              }
            }}
            className="flex items-center gap-2 px-8 py-3.5 bg-white border border-[#d0d4e4] rounded-full text-[15px] font-medium text-[#323338] hover:bg-[#e6e9ef] hover:border-transparent transition-all duration-200 shadow-sm hover:shadow"
          >
            더보기
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${visibleCount >= filteredProjects.length ? 'rotate-180' : ''}`} />
          </button>
          
          {/* No More Items Message */}
          {showNoMoreMsg && (
            <p className="text-[14px] font-medium text-[#676879] animate-in fade-in slide-in-from-top-2 duration-300">
              더 이상 표시할 항목이 없습니다.
            </p>
          )}
        </div>
      </div>
      <Footer isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <ProjectDetailModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}