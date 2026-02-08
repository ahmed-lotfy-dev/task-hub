import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { BoardColumn } from '@/features/board/components/BoardColumn/BoardColumn'
import { BoardHeader } from '@/features/board/components/BoardHeader/BoardHeader';
import { TaskDetailDialog } from '@/features/board/components/Task/Dialog/TaskDetailDialog';
import { BoardMenu } from '@/features/board/components/BoardMenu/BoardMenu';
import { useLists } from '@/hooks/use-lists'
import { useTasks } from '@/hooks/use-tasks'
import { useBoard } from '@/hooks/use-boards'
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
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { SortableTaskCard } from '@/features/board/components/SortableTaskCard/SortableTaskCard';
import { SortableBoardColumn } from '@/features/board/components/BoardColumn/SortableBoardColumn';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';


export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [searchParams] = useSearchParams()
  const cardId = searchParams.get('cardId')
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(cardId || null);
  const [isDetailOpen, setIsDetailOpen] = useState(!!cardId);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: board, isLoading: isLoadingBoard } = useBoard(boardId)
  const { data: lists, isLoading: isLoadingLists } = useLists(boardId!)
  const { data: tasks, isLoading: isLoadingTasks } = useTasks(boardId!)

  const [activeList, setActiveList] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    const type = data?.type;

    if (type === 'Task') {
      setActiveTask(data?.task);
    } else if (type === 'List') {
      setActiveList(data?.list);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveList(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const type = active.data.current?.type;

    if (type === 'List') {
      const oldIndex = lists?.findIndex(l => l.id === activeId);
      const newIndex = lists?.findIndex(l => l.id === overId);

      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        try {
          await apiFetch(`/api/lists/${activeId}`, {
            method: 'PUT',
            body: JSON.stringify({ position: Math.round(Date.now() / 1000) })
          });
          queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        } catch (e) {
          toast.error("Failed to move list");
        }
      }
      return;
    }

    // Task movement logic
    const activeTask = tasks?.find(t => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks?.find(t => t.id === overId);
    const overListId = overTask ? overTask.listId : overId;

    if (activeTask.listId !== overListId || activeId !== overId) {
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
            position: Date.now() // Standard Trello-like position logic
          })
        });
        queryClient.invalidateQueries({ queryKey });
      } catch (e) {
        if (previousTasks) {
          queryClient.setQueryData(queryKey, previousTasks);
        }
        toast.error("Failed to move task");
      }
    }
  };

  if (isLoadingLists || isLoadingTasks || isLoadingBoard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    )
  }

  const bgStyle = {
    background: (board?.background as any)?.type === 'image'
      ? `url(${(board?.background as any).value}) center center / cover no-repeat`
      : ((board?.background as any)?.value || '#f9fafb'), // Neutral-50
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={bgStyle}>
      <div className="p-4 pb-0">
        <BoardHeader
          board={board}
          boardId={boardId!}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex gap-4 p-4 h-full items-start">
            <SortableContext
              items={lists?.map(l => l.id) || []}
              strategy={horizontalListSortingStrategy}
            >
              {lists?.map(list => {
                const listTasks = tasks?.filter(t => t.listId === list.id) || [];
                const filteredTasks = listTasks.filter(task =>
                  task.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return (
                  <SortableBoardColumn
                    key={list.id}
                    id={list.id}
                    title={list.name}
                    count={filteredTasks.length}
                  >
                    <SortableContext
                      items={filteredTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-2">
                        {filteredTasks.map(task => (
                          <SortableTaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            labels={task.labels}
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
                      </div>
                    </SortableContext>
                  </SortableBoardColumn>
                );
              })}
            </SortableContext>

            {lists?.length === 0 && (
              <div className="shrink-0 w-[272px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl bg-white/10 backdrop-blur-sm self-start">
                <p className="text-sm text-white/80 mb-3 text-center">No lists in this board yet</p>
                <Button variant="secondary" size="sm" className="gap-1.5 w-full">
                  <Plus className="w-4 h-4" />
                  Add a list
                </Button>
              </div>
            )}
          </div>
        </div>

        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeTask ? (
              <div className="w-[272px]">
                <SortableTaskCard
                  id={activeTask.id}
                  title={activeTask.title}
                  labels={activeTask.labels}
                  priority={activeTask.priority as any}
                  members={1}
                  comments={0}
                />
              </div>
            ) : activeList ? (
              <div className="w-[272px] h-full opacity-80 rotate-3 transition-transform">
                <BoardColumn
                  id={activeList.id}
                  title={activeList.title}
                  count={0}
                >
                  <div className="h-32 rounded-lg bg-zinc-200/50 border border-dashed border-zinc-300" />
                </BoardColumn>
              </div>
            ) : null}
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

      {/* Board Menu Sidebar */}
      {board && (
        <BoardMenu
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          board={board}
        />
      )}
    </div>
  )
}
