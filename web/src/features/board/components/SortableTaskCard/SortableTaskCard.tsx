import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from '../TaskCard/TaskCard';

interface SortableTaskCardProps {
  id: string;
  title: string;
  listId: string;
  labels?: { id: string; name: string; color: string }[];
  members: number;
  comments: number;
  hasDescription?: boolean;
  checklistItems?: number;
  checklistCompleted?: number;
  assignees?: { id: string; name: string; image: string | null }[];
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
  onClick?: () => void;
}

export function SortableTaskCard({ id, listId, ...props }: SortableTaskCardProps) {
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
      task: { id, listId, ...props },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard id={id} {...props} />
    </div>
  );
}
