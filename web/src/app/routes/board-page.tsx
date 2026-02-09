import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { BoardColumn } from '@/features/board/components/BoardColumn/BoardColumn'
import { BoardHeader } from '@/features/board/components/BoardHeader/BoardHeader'
import { TaskDetailDialog } from '@/features/board/components/Task/Dialog/TaskDetailDialog'
import { BoardMenu } from '@/features/board/components/BoardMenu/BoardMenu'
import { AddListColumn } from '@/features/board/components/AddListColumn/AddListColumn'
import { useLists } from '@/hooks/use-lists'
import { useTasks, useUpdateTask } from '@/hooks/use-tasks'
import { useBoard } from '@/hooks/use-boards'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { useState } from 'react'
import { SortableTaskCard } from '@/features/board/components/SortableTaskCard/SortableTaskCard'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router'

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [searchParams] = useSearchParams()
  const cardId = searchParams.get('cardId')
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = useState<any>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    cardId || null,
  )
  const [isDetailOpen, setIsDetailOpen] = useState(!!cardId)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: board, isLoading: isLoadingBoard } = useBoard(boardId)
  const { data: lists, isLoading: isLoadingLists } = useLists(boardId!)
  const { data: tasks, isLoading: isLoadingTasks } = useTasks(boardId!)
  const updateTask = useUpdateTask()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current

    if (data?.type === 'Task') {
      setActiveTask(data?.task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Only handle Task dragging
    const type = active.data.current?.type
    if (type !== 'Task') return

    const activeTaskData = tasks?.find((t) => t.id === activeId)
    if (!activeTaskData) return

    // Determine the target list ID
    let overListId: string

    if (over.data.current?.type === 'Task') {
      overListId = over.data.current.task.listId
    } else if (over.data.current?.type === 'List') {
      overListId = over.data.current.list.id
    } else {
      const overList = lists?.find((l) => l.id === overId)
      if (overList) {
        overListId = overList.id
      } else {
        return
      }
    }

    // Don't reorder if not actually moving
    if (activeTaskData.listId === overListId && activeId === overId) {
      return
    }

    // Optimistically reorder tasks in the UI
    const queryKey = ['tasks', { boardId }]
    const previousTasks = queryClient.getQueryData<any[]>(queryKey) || []

    // Find the index of the task we're dragging
    const activeIndex = previousTasks.findIndex((t) => t.id === activeId)

    if (activeIndex === -1) return

    // Create new array with reordered tasks
    const newTasks = [...previousTasks]
    const [movedTask] = newTasks.splice(activeIndex, 1)

    // Update the listId if moving to a different column
    movedTask.listId = overListId

    // Find the correct position to insert
    let insertIndex: number
    if (over.data.current?.type === 'Task') {
      // Insert at the position of the task we're hovering over
      const targetIndex = newTasks.findIndex((t) => t.id === overId)
      if (targetIndex === -1) {
        insertIndex = newTasks.length
      } else {
        insertIndex = targetIndex
      }
    } else {
      // Dropped on a column - add at the end
      insertIndex = newTasks.length
    }

    newTasks.splice(insertIndex, 0, movedTask)

    queryClient.setQueryData(queryKey, newTasks)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Only handle Task dragging
    const type = active.data.current?.type
    if (type !== 'Task') return

    const activeTaskData = tasks?.find((t) => t.id === activeId)
    if (!activeTaskData) return

    // Determine the target list ID
    // over.data.current?.type could be 'Task' or 'List' (column)
    let overListId: string

    if (over.data.current?.type === 'Task') {
      // Dropped on another task - use that task's list
      overListId = over.data.current.task.listId
    } else if (over.data.current?.type === 'List') {
      // Dropped directly on a column
      overListId = over.data.current.list.id
    } else {
      // Fallback: try to find overId in lists (dropped on empty column)
      const overList = lists?.find((l) => l.id === overId)
      if (overList) {
        overListId = overList.id
      } else {
        return // Invalid drop target
      }
    }

    // Only update if actually moving to a different list or reordering
    if (activeTaskData.listId === overListId && activeId === overId) {
      return // Same position, no change needed
    }

    const queryKey = ['tasks', { boardId }]
    const previousTasks = queryClient.getQueryData<any[]>(queryKey)

    // Optimistic update
    if (previousTasks) {
      queryClient.setQueryData(
        queryKey,
        previousTasks.map((t) => {
          if (t.id === activeId) {
            return { ...t, listId: overListId }
          }
          return t
        }),
      )
    }

    try {
      // Calculate position based on tasks in target list
      const targetListTasks = tasks?.filter(t => t.listId === overListId).sort((a, b) => a.position - b.position) || []
      const overTaskIndex = targetListTasks.findIndex(t => t.id === overId)
      
      let newPosition: number
      if (overTaskIndex === -1 || overTaskIndex === targetListTasks.length - 1) {
        // Dropped at the end - use position after last task
        const lastPosition = targetListTasks[targetListTasks.length - 1]?.position ?? 0
        newPosition = lastPosition + 1000
      } else if (overTaskIndex === 0) {
        // Dropped at the beginning - use half of first task's position
        newPosition = Math.floor(targetListTasks[0].position / 2)
      } else {
        // Dropped between two tasks - use midpoint
        const prevPosition = targetListTasks[overTaskIndex - 1].position
        const nextPosition = targetListTasks[overTaskIndex].position
        newPosition = Math.floor((prevPosition + nextPosition) / 2)
      }
      
      await updateTask.mutateAsync({
        id: activeId,
        data: {
          listId: overListId,
          position: newPosition,
        },
      })
    } catch (e: any) {
      // Revert on error
      if (previousTasks) {
        queryClient.setQueryData(queryKey, previousTasks)
      }
      toast.error(`Failed to move task: ${e.message || 'Unknown error'}`)
    }
  }

  if (isLoadingLists || isLoadingTasks || isLoadingBoard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading board...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex gap-4 p-4 h-full items-start">
            {lists?.map((list) => {
              const listTasks =
                tasks?.filter((t) => t.listId === list.id) || []
              const filteredTasks = listTasks.filter((task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              return (
                <BoardColumn
                  key={list.id}
                  id={list.id}
                  title={list.name}
                  count={filteredTasks.length}
                >
                  <SortableContext
                    items={filteredTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {filteredTasks.map((task) => (
                        <SortableTaskCard
                          key={task.id}
                          id={task.id}
                          listId={task.listId}
                          title={task.title}
                          labels={task.labels}
                          priority={task.priority as any}
                          members={1}
                          comments={task.commentCount || 0}
                          assignees={task.assignees || []}
                          onClick={() => {
                            setSelectedTaskId(task.id)
                            setIsDetailOpen(true)
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </BoardColumn>
              )
            })}

            <AddListColumn boardId={boardId!} />

            {lists?.length === 0 && (
              <div className="shrink-0 w-68 flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl bg-white/10 backdrop-blur-sm self-start">
                <p className="text-sm text-white/80 mb-3 text-center">
                  No lists in this board yet
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 w-full"
                >
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
              <div className="w-68">
                <SortableTaskCard
                  id={activeTask.id}
                  listId={activeTask.listId}
                  title={activeTask.title}
                  labels={activeTask.labels}
                  priority={activeTask.priority as any}
                  members={1}
                  comments={0}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body,
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
