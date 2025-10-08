import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/shared/types/projects.types"

interface TableAllProjectsProps {
  projects: Project[]
}

export const TableAllProjects = ({ projects }: TableAllProjectsProps) => {

  return (
    <Table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800/80">
      <TableHeader className="bg-slate-50 dark:bg-slate-900/70">
        <TableRow>
          <TableHead className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400" scope="col">Name</TableHead>
          <TableHead className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400" scope="col">OWNER</TableHead>
          <TableHead className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400" scope="col">MEMBERS</TableHead>
          <TableHead className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400" scope="col">LAST UPDATED</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 bg-white/50 dark:bg-slate-900/50">
        { projects.map((project) => (
          <TableRow key={ project.id } className="hover:bg-slate-100/80 dark:hover:bg-slate-800/80">
            <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{ project.name }</TableCell>
            <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <img src={ project.createdBy.avatar } alt={ project.createdBy.name } className="h-8 w-8 rounded-full" />
                <Label
                  className="truncate max-w-[180px] text-sm font-medium text-slate-900 dark:text-white"
                  title={project.createdBy.name}
                >
                  { project.createdBy.name }
                </Label>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{ project.members.length }</TableCell>
            <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{ new Date(project.updatedAt).toLocaleDateString() }</TableCell>
          </TableRow>
        )) }
      </TableBody>
    </Table>
  )
}