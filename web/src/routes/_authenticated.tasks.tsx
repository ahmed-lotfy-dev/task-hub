import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {  useQueries } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, User, AlertCircle, ArrowUpDown } from 'lucide-react';
import { TaskDetailDialog } from '@/features/board/components/TaskDetail';
import { useTasks } from '@/hooks/use-tasks';
import { useAuth } from '@/hooks/use-auth';
import { useBoards } from '@/hooks/use-boards';
// import { useLists } from '@/hooks/use-lists';
import type { Card as CardType, List } from '@taskflow/shared';

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TasksPage,
});

function TasksPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTask, setSelectedTask] = useState<CardType | null>(null);

  // Fetch all tasks
  const { data: tasks = [], isLoading, error } = useTasks();

  // Fetch all boards to get lists
  const { data: boards = [] } = useBoards();

  // Fetch lists for all boards
  // Fetch lists for all boards
  const listsQueries = useQueries({
    queries: boards.map((board) => ({
      queryKey: ['lists', board.id],
      queryFn: async () => {
        const res = await apiFetch<List[]>(`/api/lists?boardId=${board.id}`);
        return res;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    })),
  });
  const allLists = listsQueries.flatMap((query) => query.data || []);

  // Create a map of listId to list name
  const listNameMap = new Map(allLists.map(list => [list.id, list.name]));

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task =>
    task.assignees?.some(assignee => assignee.id === user?.id)
  );

  // Apply filters
  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        comparison = priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate statistics
  const stats = {
    total: myTasks.length,
    highPriority: myTasks.filter(t => t.priority === 'high').length,
    overdue: myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const isOverdue = (task: CardType) => {
    return task.dueDate && new Date(task.dueDate) < new Date();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading tasks</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all tasks assigned to you
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold">{stats.highPriority}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Task List */}
      {sortedTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No tasks found</h3>
              <p className="text-muted-foreground">
                {myTasks.length === 0
                  ? "You don't have any tasks assigned to you yet."
                  : "Try adjusting your filters or search query."}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md hover:translate-x-1 ${isOverdue(task) ? 'border-red-300 bg-red-50/50' : ''
                }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate">{task.title}</h3>
                    {isOverdue(task) && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {(task.priority || 'medium').toUpperCase()}
                    </Badge>
                    {task.dueDate && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.dueDate)}
                      </Badge>
                    )}
                    {listNameMap.has(task.listId) && (
                      <Badge variant="secondary" className="gap-1">
                        {listNameMap.get(task.listId)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 3).map((assignee) => (
                        <div
                          key={assignee.id}
                          className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                          title={assignee.name || 'Unknown'}
                        >
                          {(assignee.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {task.assignees.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                          +{task.assignees.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailDialog
          taskId={selectedTask.id}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  );
}
