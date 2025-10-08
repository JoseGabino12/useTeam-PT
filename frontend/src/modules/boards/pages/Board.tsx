import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { useBoard } from "../hooks/useBoard";
import { BoardColumn } from "../components/BoardColumn";
import { Header } from "@/shared/components/header/Header";
import { useBoardSocket } from "../hooks/useBoardSocket";
import { usersApi } from "../services/users.api";
import type { User } from "@/shared/types/auth.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { exportApi } from "../services/export.api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

export function Board () {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const { user } = useAuthStore();
  const { boardDetail, fetchBoardDetail, createCard, moveCard, addMember } = useBoard();
  const boardId = boardDetail?.id;
  const hasLoadedUsersRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useBoardSocket({
    boardId: boardId!,
    onCardCreated: () => fetchBoardDetail(boardId!), // Refresca cuando se crea
    onCardMoved: () => fetchBoardDetail(boardId!),   // Refresca cuando se mueve
  });

  const fetchUsers = useCallback(async () => {
    if (hasLoadedUsersRef.current) return;
    try {
      setUsersLoading(true);
      setUsersError(null);
      const data = await usersApi.getAll();
      setUsers(data);
      hasLoadedUsersRef.current = true;
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsersError("Failed to load users");
      toast.error("Unable to load users");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isShareDialogOpen) {
      void fetchUsers();
    }
  }, [fetchUsers, isShareDialogOpen]);

  useEffect(() => {
    if (!isShareDialogOpen) {
      setSelectedUserIds([]);
    }
  }, [isShareDialogOpen]);

  const currentMemberIds = useMemo(() => {
    if (!boardDetail?.members) return new Set<string>();
    return new Set(boardDetail.members.map((member) => member.userId));
  }, [boardDetail]);

  const toggleUserSelection = (userId: string, checked: boolean | "indeterminate") => {
    if (currentMemberIds.has(userId)) return;

    setSelectedUserIds((prev) => {
      if (checked === true || checked === "indeterminate") {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      }
      return prev.filter((id) => id !== userId);
    });
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) return;

    setIsAddingMembers(true);
    const addedUserIds: string[] = [];
    try {
      for (const userId of selectedUserIds) {
        await addMember(userId, "viewer");
        addedUserIds.push(userId);
      }
      const addedCount = addedUserIds.length;
      toast.success(addedCount > 1 ? `${addedCount} members added to board` : "Member added to board");
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Error adding members to board:", error);
      setSelectedUserIds((prev) => prev.filter((id) => !addedUserIds.includes(id)));
      if (addedUserIds.length > 0) {
        toast.success(addedUserIds.length > 1 ? `${addedUserIds.length} members added before the error` : "Member added before the error");
      }
      toast.error("Failed to add some members to board");
    } finally {
      setIsAddingMembers(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;
    const cardId = active.id as string;
    const newColumnId = over.id as string;

    // Evitar re-mover dentro de la misma columna
    const fromColumnId = active.data.current?.columnId;
    if (fromColumnId === newColumnId) return;

    // Actualiza backend
    await moveCard(cardId, newColumnId);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header withNav />
      <main className="flex-1 overflow-x-auto">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-3xl font-bold text-background-dark dark:text-background-light">
              { boardDetail?.name }
            </h2>
            <AlertDialog open={ isShareDialogOpen } onOpenChange={ setIsShareDialogOpen }>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Share board</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose how you want to collaborate on this board.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-6">
                  <div className="space-y-3 rounded-lg border border-slate-200/80 p-4 dark:border-slate-800/80">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Export board</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Generate a copy of this board to share it outside the workspace.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      type="button"
                      onClick={ async () => {
                        if (!boardId) return toast.error("No board selected");

                        try {
                          toast.loading("Solicitando exportación...");
                          // Puedes cambiar el email por el del usuario logueado
                          const email = user?.email ?? "";
                          const res = await exportApi.exportBacklog(boardId, email);
                          toast.success(res.message ?? "Exportación iniciada correctamente");
                        } catch (err) {
                          console.error("Error exporting backlog:", err);
                          toast.error("No se pudo iniciar la exportación");
                        } finally {
                          toast.dismiss();
                        }
                      } }
                    >
                      Export board
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Add user to board
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Select a teammate to invite to this board.
                      </p>
                    </div>
                    <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/80 dark:bg-slate-900/40">
                      {
                        usersLoading ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">Loading users...</p>
                        ) : usersError ? (
                          <p className="text-sm text-destructive">{ usersError }</p>
                        ) : users.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No users available.</p>
                        ) : (
                          <ul className="space-y-2">
                            {
                              users.map((user) => (
                                <li
                                  key={ user.id }
                                  className="rounded-md border border-slate-200/70 bg-white/80 px-3 py-2 text-left shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60"
                                >
                                  <label className="flex items-start gap-3">
                                    <Checkbox
                                      checked={ selectedUserIds.includes(user.id) || currentMemberIds.has(user.id) }
                                      disabled={ currentMemberIds.has(user.id) || isAddingMembers }
                                      onCheckedChange={ (checked) => toggleUserSelection(user.id, checked) }
                                    />
                                    <div className="flex flex-col">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        { user.name }
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        { user.email }
                                      </p>
                                      {
                                        currentMemberIds.has(user.id) && (
                                          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                            Already in this board
                                          </span>
                                        )
                                      }
                                    </div>
                                  </label>
                                </li>
                              ))
                            }
                          </ul>
                        )
                      }
                    </div>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={ isAddingMembers }>Close</AlertDialogCancel>
                  <Button
                    type="button"
                    onClick={ handleAddMembers }
                    disabled={ selectedUserIds.length === 0 || isAddingMembers }
                  >
                    { isAddingMembers ? "Adding..." : "Add to board" }
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <DndContext sensors={ sensors } onDragEnd={ handleDragEnd }>
            <div className="flex gap-6">
              { boardDetail?.columns.map((column) => (
                <BoardColumn
                  key={ column.id }
                  column={ column }
                  createCard={ createCard }
                />
              )) }
            </div>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
