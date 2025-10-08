import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlusIcon } from "lucide-react"
import { useState } from "react"

interface CreationModalProps {
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const CreationModal = ({ isSubmitting, handleSubmit }: CreationModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(e);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={ () => setOpen(true) } className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
          <PlusIcon className="mr-2 h-5 w-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmitWrapper }>
          <DialogHeader className="mb-4">
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Organize your work and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="projectName">Project Name</Label>
              <Input className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm" id="projectName" name="projectName" placeholder="e.g., Q4 Marketing Campaign" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="projectDescription">Project Description</Label>
              <div className="mt-1">
                <Textarea className="form-textarea block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shadow-sm focus:border-primary focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" id="projectDescription" name="projectDescription" placeholder="A brief description of your project..."></Textarea>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex items-center justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={ isSubmitting }>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}