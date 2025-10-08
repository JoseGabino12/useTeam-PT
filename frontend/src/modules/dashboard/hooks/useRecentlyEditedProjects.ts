import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import type { Project } from "@/shared/types/projects.types";


export function useRecentlyEditedProjects (boards: Project[]) {
  return useMemo(() => {
    if (!boards || boards.length === 0) return [];

    return [...boards]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 4) // Get the 4 most recently edited projects
      .map((project) => ({
        ...project,
        timeAgo: formatDistanceToNow(new Date(project.updatedAt), {
          addSuffix: true,
          locale: enUS,
        }),
      }));
  }, [boards]);
}