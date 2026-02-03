import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";

interface SortableTaskCardProps {
  id: string;
  title: string;
  tags: string[];
  members: number;
  comments: number;
  assignees?: { id: string; name: string; image: string | null }[];
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  onClick?: () => void;
}

export function SortableTaskCard({ id, ...props }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Task",
      task: { id, ...props },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard id={id} {...props} priority={props.priority} />
    </div>
  );
}
