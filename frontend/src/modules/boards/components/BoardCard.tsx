import type { Card } from "@/shared/types/cards.types"
import { useDraggable } from "@dnd-kit/core";

interface BoardCardProps {
  card: Card,
  parentColumnName: string
}

export const BoardCard = ({ card, parentColumnName }: BoardCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
      data: { columnId: card.columnId },
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={ setNodeRef }
      style={ style }
      { ...listeners }
      { ...attributes }
      className={ `cursor-grab rounded-lg border border-primary/20 bg-background-light p-4 shadow-sm dark:bg-background-dark ${isDragging ? "opacity-50" : ""
        }` }
    >
      <h4 className="font-bold text-background-dark dark:text-background-light">{ card.title }</h4>
      <p className="text-sm text-primary/70 dark:text-primary/70">{ card.description }</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-green-500">{parentColumnName}</span>
        <div className="flex items-center gap-2">
          {card.dueDate && (
            <span className="text-xs text-primary/70">
              Due:{" "}
              {new Date(card.dueDate).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <img
            src={card.createdBy.avatar}
            alt={card.createdBy.name}
            className="h-6 w-6 rounded-full ring-1 ring-primary/30"
          />
        </div>
      </div>
    </div>
  )
}