import type { Column } from "@/shared/types/columns.types";
import { CardCreationModal } from "./CardCreationModal";
import { useState } from "react";
import type { PayloadCard, Priority, Tags } from "@/shared/types/cards.types";
import { BoardCard } from "./BoardCard";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: Column;
  createCard: (data: PayloadCard) => Promise<void>;
};

export const BoardColumn = ({ column, createCard }: ColumnProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setNodeRef } = useDroppable({ id: column.id });


  const handleSubmit = async (data: Record<string, string | string[] | File>) => {
    try {
      setIsSubmitting(true);
      await createCard({
        columnId: column.id,
        title: data.title as string,
        description: data.description as string,
        priority: data.priority as Priority,
        tags: data.tags as Tags[],
        dueDate: data.dueDate as string,
        boardId: column.boardId,
        createdBy: data.createdBy as string,
      });
    } catch (error) {
      console.error("Error creating card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={ setNodeRef } className="flex w-72 flex-col rounded-lg bg-primary/5 dark:bg-primary/10">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-bold text-background-dark dark:text-background-light">{ column.name }</h3>
        <CardCreationModal isSubmitting={ isSubmitting } handleSubmit={ handleSubmit } />
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0">
        { column.cards.map(card => (
          <BoardCard key={ card.id } card={ card } parentColumnName={ column.name } />
        )) }
      </div>
    </div>
  )
}