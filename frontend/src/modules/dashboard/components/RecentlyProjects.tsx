import type { Project } from "@/shared/types/projects.types";
import { useRecentlyEditedProjects } from "../hooks/useRecentlyEditedProjects";
interface RecentlyProjectsProps {
  projects: Project[]
}

export const RecentlyProjects = ({ projects }: RecentlyProjectsProps) => {
  const recent = useRecentlyEditedProjects(projects);

  if (recent.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
        Recently edited
      </h2>
      <div className="no-scrollbar mt-4 -mx-4 flex gap-4 overflow-x-auto px-4 pb-4">
        { recent.map((project) => (
          <a
            key={ project.id }
            className="group block w-64 flex-shrink-0"
            href={ `/board/${project.id}` }
          >
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <img
                alt={ `${project.name} thumbnail` }
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={ `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${project.name}` }
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <img
                src={ project.createdBy.avatar }
                alt={ project.createdBy.name }
                className="h-8 w-8 rounded-full"
              />
              <div className="min-w-0">
                <p
                  className="truncate font-medium text-slate-800 dark:text-slate-100"
                  title={ project.name }
                >
                  { project.name }
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last edited { project.timeAgo }
                </p>
              </div>
            </div>
          </a>
        )) }
      </div>
    </section>
  );
};