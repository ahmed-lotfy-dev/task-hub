"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { InviteDialog } from "@/components/invitation/invite-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useBoardMembers } from "@/hooks/use-board-members";
import { MemberAvatars } from "@/components/ui/MemberAvatars/MemberAvatars";
import { WorkspaceMembersModal } from "@/features/workspace/components/WorkspaceMembersModal/WorkspaceMembersModal";

// Extracted Components
import { BoardIcon } from "./BoardIcon";
import { StarButton } from "./StarButton";
import { SearchInput } from "./SearchInput";
import { FilterButton } from "./FilterButton";
import { SortButton } from "./SortButton";
import { AddListForm } from "./AddListForm";

interface BoardHeaderProps {
  board: any;
  boardId: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSettingsClick?: () => void;
}

export function BoardHeader({
  board,
  boardId,
  searchQuery,
  setSearchQuery,
  onSettingsClick,
}: BoardHeaderProps) {
  const queryClient = useQueryClient();
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.id === board?.workspaceId);
  const { data: members } = useBoardMembers(boardId);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);

  const createListMutation = useMutation({
    mutationFn: async (name: string) => {
      return apiFetch(`/api/lists`, {
        method: "POST",
        body: JSON.stringify({
          boardId,
          name,
          position: Date.now(),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
      toast.success("List created");
      setIsAddingList(false);
      setNewListName("");
    },
    onError: () => {
      toast.error("Failed to create list");
    },
  });

  const handleCreateList = () => {
    if (newListName.trim()) {
      createListMutation.mutate(newListName.trim());
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-6 group">
        <div className="flex items-center gap-4">
          <BoardIcon name={board?.name} className="text-cyan-700 dark:text-cyan-400" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 cursor-default font-sans">
                {board?.name || "Board"}
              </h1>
              <StarButton className="text-slate-400 hover:text-amber-400" />
            </div>
            {workspace && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {workspace.name}
              </span>
            )}
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

        <div className="flex items-center gap-2">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center gap-1 text-slate-500">
            <FilterButton />
            <SortButton />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 p-1 bg-white/50 dark:bg-white/5 rounded-lg border border-slate-200/50 dark:border-white/10 shadow-sm">
          {workspace && (
            <WorkspaceMembersModal workspaceId={workspace.id} workspaceName={workspace.name}>
              <MemberAvatars
                members={members || []}
                showCount
                className="hover:scale-105 transition-transform"
              />
            </WorkspaceMembersModal>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />

          <InviteDialog boardId={boardId} />

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />

          {isAddingList ? (
            <AddListForm
              value={newListName}
              onChange={setNewListName}
              onSubmit={handleCreateList}
              onCancel={() => {
                setIsAddingList(false);
                setNewListName("");
              }}
              isLoading={createListMutation.isPending}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 dark:text-slate-300 dark:hover:bg-white/10 rounded-md font-medium text-sm gap-1.5 transition-all"
              onClick={() => setIsAddingList(true)}
            >
              <Plus className="w-4 h-4" />
              Add List
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 rounded-md transition-colors"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
