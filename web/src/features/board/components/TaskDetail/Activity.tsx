import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailActivityProps {
  taskId: string;
  userId?: string;
}

export function TaskDetailActivity({ taskId, userId }: TaskDetailActivityProps) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: async () => {
      if (!taskId) return [];
      return apiFetch<any[]>(`/api/comments/card/${taskId}`);
    },
    enabled: !!taskId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiFetch(`/api/comments/card/${taskId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return apiFetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-zinc-400 stroke-[2.5]" />
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">Activity</h3>
          <span className="bg-zinc-100 text-zinc-500 font-black text-[10px] px-2 py-0.5 rounded-full">
            {comments?.length || 0}
          </span>
        </div>
        {isLoadingComments && <Loader2 className="w-3 h-3 animate-spin text-zinc-300" />}
      </div>

      <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100/50">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-4 group relative items-start">
            <Avatar className="w-8 h-8 ring-2 ring-white border-zinc-100 border shadow-sm z-10 shrink-0">
              <AvatarImage src={comment.user.image} />
              <AvatarFallback className="text-[10px] font-bold bg-zinc-50">{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-zinc-900">{comment.user.name}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                  <Clock className="w-2.5 h-2.5" />
                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                </div>
              </div>
              <div className="text-sm font-medium text-zinc-600 leading-relaxed bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm group-hover:shadow-md transition-all">
                {comment.content}
              </div>
            </div>
            {userId === comment.user.id && (
              <button
                className="opacity-0 group-hover:opacity-100 transition-all self-start mt-8 p-1.5 hover:bg-red-50 text-zinc-200 hover:text-red-500 rounded-lg shrink-0"
                onClick={() => deleteCommentMutation.mutate(comment.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-6">
        <Avatar className="w-9 h-9 ring-4 ring-primary/5 border-primary/10 border shrink-0">
          <AvatarFallback className="text-xs font-black bg-primary/5 text-primary">Me</AvatarFallback>
        </Avatar>
        <div className="flex-1 relative group/input">
          <Textarea
            className="bg-zinc-50/50 min-h-[100px] py-4 pr-12 text-sm font-medium border-none ring-1 ring-zinc-200/50 focus-visible:ring-primary/20 focus-visible:bg-white transition-all rounded-2xl resize-none shadow-sm placeholder:text-zinc-300"
            placeholder="Type your message..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (commentText.trim()) createCommentMutation.mutate(commentText);
              }
            }}
          />
          <div className="absolute right-3 bottom-3">
            <Button
              size="icon"
              className={cn(
                "h-8 w-8 rounded-xl shadow-lg transition-all",
                commentText.trim() ? "bg-primary hover:bg-primary/90 scale-100" : "bg-zinc-200 scale-90"
              )}
              disabled={!commentText.trim() || createCommentMutation.isPending}
              onClick={() => createCommentMutation.mutate(commentText)}
            >
              {createCommentMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-4 h-4 fill-current" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
