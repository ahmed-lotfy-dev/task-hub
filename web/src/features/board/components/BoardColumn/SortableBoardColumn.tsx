"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardColumn } from "./BoardColumn";

interface SortableBoardColumnProps {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}

export function SortableBoardColumn({ id, title, count, children }: SortableBoardColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "List",
      list: { id, title },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full">
      <BoardColumn id={id} title={title} count={count}>
        {children}
      </BoardColumn>
    </div>
  );
}
