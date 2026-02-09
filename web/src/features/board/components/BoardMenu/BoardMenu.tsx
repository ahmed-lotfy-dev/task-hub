"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Activity, Settings, Archive, CreditCard, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { BoardSettingsDialog } from "../BoardSettingsDialog/BoardSettingsDialog";
import { formatDistanceToNow } from "date-fns";

interface BoardMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: any;
  activities?: any[]; // Placeholder for now
}

export function BoardMenu({ open, onOpenChange, board, activities = [] }: BoardMenuProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Placeholder activities if none provided
  const displayActivities = activities.length > 0 ? activities : [
    { id: 1, user: { name: "Ahmed Lotfy", fallback: "AL" }, action: "added a list", target: "To Do", time: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: { name: "Ahmed Lotfy", fallback: "AL" }, action: "moved card", target: "Fix Bug", time: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 3, user: { name: "System", fallback: "S" }, action: "created board", target: board?.name, time: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[340px] sm:w-[340px] p-0 flex flex-col gap-0" side="right">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-center text-sm font-semibold text-foreground">Menu</SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 flex flex-col gap-4">
              {/* Menu Items */}
              <div className="flex flex-col gap-1">
                <Button variant="ghost" className="justify-start gap-2 h-9 px-2 font-normal text-foreground" onClick={() => console.log("About")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  About this board
                </Button>
                <Button variant="ghost" className="justify-start gap-2 h-9 px-2 font-normal text-foreground" onClick={() => console.log("Background")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  Change background
                </Button>
                <Button variant="ghost" className="justify-start gap-2 h-9 px-2 font-normal text-foreground" onClick={() => setIsSettingsOpen(true)}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  Settings
                </Button>
                <Button variant="ghost" className="justify-start gap-2 h-9 px-2 font-normal text-foreground hover:bg-red-50 hover:text-red-600">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Archive className="w-4 h-4" />
                  </div>
                  Close board
                </Button>
              </div>

              <Separator />

              {/* Activity Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                  <Activity className="w-4 h-4" />
                  Activity
                </div>

                <div className="flex flex-col gap-4">
                  {displayActivities.map((activity: any) => (
                    <div key={activity.id} className="flex gap-2 text-sm">
                      <Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarImage src={activity.user.image} />
                        <AvatarFallback className="text-xs bg-muted text-foreground">{activity.user.fallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-foreground">
                          <span className="font-semibold">{activity.user.name}</span> {activity.action} <span className="underline decoration-1 cursor-pointer">{activity.target}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(activity.time, { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Nested Settings Dialog */}
      {board && (
        <BoardSettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          boardId={board.id}
          boardName={board.name}
          workspaceSlug={board.workspaceSlug} // Assuming workspaceSlug is flattened or handled inside
        />
      )}
    </>
  );
}
