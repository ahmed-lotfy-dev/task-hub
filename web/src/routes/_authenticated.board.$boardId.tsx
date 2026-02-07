import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { BoardColumn } from '@/features/board/components/BoardColumn'
import { useLists } from '@/hooks/use-lists'
import { useTasks } from '@/hooks/use-tasks'
import { useBoards } from '@/hooks/use-boards'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { SortableTaskCard } from '@/features/board/components/SortableTaskCard';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { TaskDetailDialog } from '@/features/board/components/TaskDetail';
import { BoardHeader } from '@/features/board/components/BoardHeader';
import { BoardSettingsDialog } from '@/features/board/components/BoardSettingsDialog';

import { z } from 'zod';

const boardSearchSchema = z.object({
  cardId: z.string().optional(),
});

export const Route = createFileRoute('/_authenticated/board/$boardId')({
  component: BoardPage,
  validateSearch: (search) => boardSearchSchema.parse(search),
})

function BoardPage() {
  const { boardId } = Route.useParams()
  const { cardId } = Route.useSearch()
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(cardId || null);
  const [isDetailOpen, setIsDetailOpen] = useState(!!cardId);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: boards } = useBoards()
  const { data: lists, isLoading: isLoadingLists } = useLists(boardId)
  const { data: tasks, isLoading: isLoadingTasks } = useTasks(boardId)

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental clicks)
      },
    })
  );

  const board = boards?.find(b => b.id === boardId)

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
    const task = tasks?.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks?.find(t => t.id === activeId);
    if (!activeTask) return;

    // Find the container (list) of the over item
    // If over is a list (column), then overId is listId.
    // If over is a task, find that task's listId.
    const overTask = tasks?.find(t => t.id === overId);
    const overListId = overTask ? overTask.listId : overId; // If over board column directly, id is listId

    if (activeTask.listId !== overListId) {
      // Optimistic update
      const queryKey = ['tasks', { boardId }];
      const previousTasks = queryClient.getQueryData<any[]>(queryKey);

      if (previousTasks) {
        queryClient.setQueryData(queryKey, previousTasks.map(t => {
          if (t.id === activeId) {
            return { ...t, listId: overListId };
          }
          return t;
        }));
      }

      try {
        await apiFetch(`/api/tasks/${activeId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            listId: overListId,
            position: 65535 // TODO: Calculate actual position
          })
        });
        queryClient.invalidateQueries({ queryKey });
      } catch (e) {
        // Rollback
        if (previousTasks) {
          queryClient.setQueryData(queryKey, previousTasks);
        }
        toast.error("Failed to move task");
      }
    } else if (activeId !== overId) {
      // Reordering in same list
      // TODO: Implement position update logic
      // This requires finding the new index and updating position field
    }
  };

  if (isLoadingLists || isLoadingTasks) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading board...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <BoardHeader
        board={board}
        boardId={boardId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-8 items-start overflow-x-auto pb-4 min-h-[60vh]">
          {lists?.map(list => {
            const listTasks = tasks?.filter(t => t.listId === list.id) || [];
            const filteredTasks = listTasks.filter(task =>
              task.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return (
              <div key={list.id} className="min-w-[320px] max-w-[320px] h-full">
                <BoardColumn
                  id={list.id}
                  title={list.name}
                  count={filteredTasks.length}
                  variant={
                    list.name.toLowerCase().includes("progress") ? "blue" :
                      list.name.toLowerCase().includes("review") ? "orange" :
                        list.name.toLowerCase().includes("done") || list.name.toLowerCase().includes("completed") ? "green" :
                          "default"
                  }
                >
                  <SortableContext items={filteredTasks.map(t => t.id)}>
                    {filteredTasks.map(task => (
                      <SortableTaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        tags={task.priority ? [task.priority] : []}
                        priority={task.priority as any}
                        members={1}
                        comments={task.commentCount || 0}
                        assignees={task.assignees || []}
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsDetailOpen(true);
                        }}
                      />
                    ))}
                  </SortableContext>
                </BoardColumn>
              </div>
            );
          })}

          {lists?.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/50 rounded-[32px] border-2 border-dashed border-zinc-200">
              <p className="text-zinc-500 font-bold mb-4">No lists in this board yet</p>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create your first list
              </Button>
            </div>
          )}
        </div>
        {createPortal(
          <DragOverlay>
            {activeTask && (
              <SortableTaskCard
                id={activeTask.id}
                title={activeTask.title}
                tags={activeTask.priority ? [activeTask.priority] : []}
                priority={activeTask.priority as any}
                members={1}
                comments={0}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {/* Task Detail Dialog */}
      {isDetailOpen && (
        <TaskDetailDialog
          taskId={selectedTaskId}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}

      {/* Board Settings Dialog */}
      {board && (
        <BoardSettingsDialog
          boardId={boardId}
          boardName={board.name}
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      )}
    </div>
  )
}
