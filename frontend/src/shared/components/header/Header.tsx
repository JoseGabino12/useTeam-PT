import { Logo } from "@/assets/icons/Logo";
import { Nav } from "./Nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  withNav?: boolean;
}

export const Header = ({ withNav }: HeaderProps) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white" onClick={ () => navigate("/") } style={{ cursor: "pointer" }}>
            <Logo />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          {
            withNav && (
              <Nav />
            )
          }
        </div>

        { withNav && (
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
              </div>
              <Input className="h-9 w-full rounded-lg border-0 bg-slate-100 dark:bg-slate-800/50 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Search" type="search" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full overflow-hidden border border-transparent transition hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <img
                    alt={ user?.name ? `${user.name} avatar` : "User avatar" }
                    className="h-full w-full object-cover"
                    src={ user?.avatar ?? "https://api.dicebear.com/9.x/fun-emoji/svg?eyes=plain&mouth=smile&size=144" }
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" side="bottom" className="w-64">
                <div className="flex items-center gap-3">
                  <img
                    alt={ user?.name ? `${user.name} avatar` : "User avatar" }
                    className="h-12 w-12 rounded-full object-cover"
                    src={ user?.avatar ?? "https://api.dicebear.com/9.x/fun-emoji/svg?eyes=plain&mouth=smile&size=144" }
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ user?.name ?? "Guest" }</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ user?.email ?? "No email available" }</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start text-sm font-medium text-red-600 hover:text-red-600"
                    onClick={ logOut }
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) }
      </div>
    </header>
  )
}
