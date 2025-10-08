import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDownIcon, Loader2, PlusIcon } from "lucide-react"
import { useState } from "react"
import MultipleSelector, { type Option } from "@/components/ui/multiselect"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"


interface CardCreationModalProps {
  isSubmitting: boolean;
  handleSubmit: (data: Record<string, string | string[] | File>) => Promise<void>;
}

const tags: Option[] = [
  { label: 'Bug', value: 'bug' },
  { label: 'Feature', value: 'feature' },
  { label: 'Design', value: 'design' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Research', value: 'research' },
];

export const CardCreationModal = ({ isSubmitting, handleSubmit }: CardCreationModalProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmitWrapper = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    formData.set("dueDate", date ? date.toISOString() : "");

    // Convert FormData to a plain object
    const data: Record<string, string | string[] | File> = Object.fromEntries(formData.entries());

    // Make sure tags is an array
    data.tags = selectedTags.map((tag) => tag.value);

    await handleSubmit(data); 
    setOpen(false);
  };

  return (
    <Dialog open={ open } onOpenChange={ setOpen }>
      <DialogTrigger asChild>
        <button onClick={ () => setOpen(true) } className="text-primary/70 hover:text-primary">
          <PlusIcon className="mr-2 h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={ handleSubmitWrapper }>
          <DialogHeader className="mb-4">
            <DialogTitle>Add a new card</DialogTitle>
            <DialogDescription>
              Organize your work and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g., Make the marketing video" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <div className="mt-1">
                <Textarea className="form-textarea block w-full rounded-lg" id="description" name="description" placeholder="A brief description of your task..."></Textarea>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="priority">Priority</Label>
              <div className="mt-1">
                <Select name="priority">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="*:not-first:mt-2">
                <Label>Multiselect</Label>
                <MultipleSelector
                  commandProps={ {
                    label: "Select tags",
                  } }
                  defaultOptions={ tags }
                  inputProps={ {
                    name: "tags",
                  } }
                  onChange={ setSelectedTags }
                  placeholder="Select tags"
                  emptyIndicator={ <p className="text-center text-sm">No results found</p> }
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="dueDate" className="px-1">
                Due date
              </Label>
              <Popover open={ calendarOpen } onOpenChange={ setCalendarOpen }>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="dueDate"
                    name="dueDate"
                    className="w-48 justify-between font-normal"
                  >
                    { date ? date.toLocaleDateString() : "Select date" }
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={ date }
                    captionLayout="dropdown"
                    onSelect={ (date) => {
                      setDate(date)
                      setCalendarOpen(false)
                    } }
                  />
                </PopoverContent>
              </Popover>
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