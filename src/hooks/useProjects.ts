import { useState, useMemo } from "react";
import type { ProjectData } from "@/types";

export type SortOption = "최신순" | "오래된순" | "가나다순";

const PAGE_SIZE = 6;

export function useProjects(projects: ProjectData[]) {
  const [activeTag, setActiveTag] = useState("전체");
  const [sortOption, setSortOption] = useState<SortOption>("최신순");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showNoMoreMsg, setShowNoMoreMsg] = useState(false);

  const allTags = useMemo(
    () => ["전체", ...Array.from(new Set(projects.flatMap((p) => p.tags)))].slice(0, 10),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const filtered =
      activeTag === "전체" ? projects : projects.filter((p) => p.tags.includes(activeTag));

    return [...filtered].sort((a, b) => {
      if (sortOption === "가나다순") return a.title.localeCompare(b.title);
      if (sortOption === "오래된순") return a.period.localeCompare(b.period);
      return b.period.localeCompare(a.period);
    });
  }, [projects, activeTag, sortOption]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  function handleTagChange(tag: string) {
    setActiveTag(tag);
    setVisibleCount(PAGE_SIZE);
    setShowNoMoreMsg(false);
  }

  function handleSortChange(option: SortOption) {
    setSortOption(option);
    setVisibleCount(PAGE_SIZE);
    setShowNoMoreMsg(false);
  }

  function loadMore() {
    if (hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    } else {
      setShowNoMoreMsg(true);
    }
  }

  return {
    allTags,
    activeTag,
    sortOption,
    visibleProjects,
    filteredProjects,
    showNoMoreMsg,
    hasMore,
    handleTagChange,
    handleSortChange,
    loadMore,
  };
}
