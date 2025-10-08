import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Header } from "@/shared/components/header/Header";
import { RecentlyProjects } from "../components/RecentlyProjects";
import { useBoards } from "../hooks/useBoards";
import { TableAllProjects } from "../components/TableAllProjects";
import { HotelIcon, Loader2, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreationModal } from "../components/CreationModal";

export function Dashboard () {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuthStore();
  const { boards, createBoard, loading, error } = useBoards();

  const showLoader = loading && boards.length === 0;
  const hasBoards = boards.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("projectName") as string;
    const description = formData.get("projectDescription") as string;

    if (user) {
      try {
        setIsSubmitting(true);
        await createBoard({ name, description: description || undefined });
        toast.success("Project created successfully");
        form.reset();
      } catch (error) {
        console.error("Error creating board:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex h-screen flex-col">
      <Header withNav />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, { user?.name }</h1>

            {
              showLoader ? (
                <section className="mt-10">
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300/70 bg-white/60 p-12 text-center dark:border-slate-700/70 dark:bg-slate-900/40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-base font-medium text-slate-600 dark:text-slate-300">Loading projects...</p>
                  </div>
                </section>
              ) : (
                <>
                  { hasBoards && <RecentlyProjects projects={ boards } /> }

                  {
                    hasBoards ? (
                      <section className="mt-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">All projects</h2>
                          <div className="flex items-center gap-2">
                            <CreationModal isSubmitting={ isSubmitting } handleSubmit={ handleSubmit } />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                              <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            </div>
                            <Input className="h-12 w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 pl-12 pr-4 text-base text-slate-800" placeholder="Search projects..." type="search" />
                          </div>
                        </div>
                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                          <TableAllProjects projects={ boards } />
                        </div>
                      </section>
                    ) : (
                      <section className="mt-10">
                        <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                          <HotelIcon className="mx-auto h-20 w-20 text-primary stroke-1" />
                          <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Start Your First Project</h2>
                          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">Let's get you organized. Create your first project to start tracking tasks, collaborating with your team, and achieving your goals.</p>
                          <div className="mt-8">
                            <CreationModal isSubmitting={ isSubmitting } handleSubmit={ handleSubmit } />
                          </div>
                        </div>
                      </section>
                    )
                  }
                </>
              )
            }
          </div>
        </div>
      </main>
    </div>
  )
}
