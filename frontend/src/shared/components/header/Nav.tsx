export const Nav = () => {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary" href="#">Home</a>
      <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary" href="#">My Tasks</a>
      <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary" href="#">Inbox</a>
      <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary" href="#">Reports</a>
    </nav>
  )
}