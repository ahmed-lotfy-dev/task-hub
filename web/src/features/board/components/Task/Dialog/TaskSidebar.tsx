import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Users, Calendar, Tag, Info, Columns } from "lucide-react";

interface TaskDetailSidebarProps {
  assignees: any[];
  candidates: any[];
  lists?: any[];
  currentListId?: string;
  currentUserId?: string;
  onAssign: (userId: string) => void;
  onUnassign: (userId: string) => void;
  onChangeList?: (listId: string) => void;
}

export function TaskDetailSidebar({
  assignees,
  candidates,
  lists,
  currentListId,
  currentUserId,
  onAssign,
  onUnassign,
  onChangeList,
}: TaskDetailSidebarProps) {
  return (
    <div className="space-y-6">
      <ListSection
        lists={lists}
        currentListId={currentListId}
        onChangeList={onChangeList}
      />
      <AssigneesSection
        assignees={assignees}
        currentUserId={currentUserId}
        candidates={candidates}
        onAssign={onAssign}
        onUnassign={onUnassign}
      />
      <TaskMetaSections />
      <TaskInfoBox />
    </div>
  );
}

function ListSection({
  lists,
  currentListId,
  onChangeList,
}: {
  lists?: any[];
  currentListId?: string;
  onChangeList?: (listId: string) => void;
}) {
  if (!lists || lists.length === 0 || !onChangeList) return null;

  const currentList = lists.find((l) => l.id === currentListId);

  return (
    <div className="space-y-2">
      <SectionLabel icon={Columns} label="Status" />
      <Select value={currentListId} onValueChange={onChangeList}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status">
            {currentList?.name || "Select status"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {lists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AssigneesSection({
  assignees,
  currentUserId,
  candidates,
  onAssign,
  onUnassign,
}: {
  assignees: any[];
  currentUserId?: string;
  candidates: any[];
  onAssign: (userId: string) => void;
  onUnassign: (userId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <SectionLabel icon={Users} label="Assignees" />

      <div className="space-y-2">
        {assignees?.map((assignee) => (
          <AssigneeItem
            key={assignee.id}
            assignee={assignee}
            currentUserId={currentUserId}
            onUnassign={onUnassign}
          />
        ))}

        <AddAssigneeSelect
          candidates={candidates}
          assignees={assignees}
          currentUserId={currentUserId}
          onAssign={onAssign}
        />
      </div>
    </div>
  );
}

function AssigneeItem({
  assignee,
  currentUserId,
  onUnassign,
}: {
  assignee: any;
  currentUserId?: string;
  onUnassign: (userId: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors">
      <Avatar className="w-7 h-7">
        <AvatarImage src={assignee.image} />
        <AvatarFallback className="text-xs">{assignee.name?.[0]}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium truncate flex-1">
        {assignee.name}
        {assignee.id === currentUserId && (
          <span className="text-muted-foreground ml-1">(You)</span>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-destructive"
        onClick={() => onUnassign(assignee.id)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

function AddAssigneeSelect({
  candidates,
  assignees,
  currentUserId,
  onAssign,
}: {
  candidates: any[];
  assignees: any[];
  currentUserId?: string;
  onAssign: (userId: string) => void;
}) {
  // Get unassigned candidates
  const unassignedCandidates = candidates?.filter(
    (c) => !assignees?.some((a) => a.id === c.id)
  ) || [];

  if (unassignedCandidates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-2">
        All members assigned
      </div>
    );
  }

  return (
    <Select
      onValueChange={(value) => {
        if (value && value !== "placeholder") {
          onAssign(value);
        }
      }}
    >
      <SelectTrigger className="w-full justify-start gap-2 border-dashed">
        <Plus className="w-4 h-4" />
        <SelectValue placeholder="Add member" />
      </SelectTrigger>
      <SelectContent>
        {unassignedCandidates.map((candidate) => (
          <SelectItem key={candidate.id} value={candidate.id}>
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={candidate.image} />
                <AvatarFallback className="text-[10px]">
                  {candidate.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {candidate.name}
                {candidate.id === currentUserId && (
                  <span className="text-muted-foreground ml-1">(You)</span>
                )}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TaskMetaSections() {
  return (
    <div className="space-y-4 pt-4 border-t">
      <DatesSection />
      <LabelsSection />
    </div>
  );
}

function DatesSection() {
  return (
    <div className="space-y-2">
      <SectionLabel icon={Calendar} label="Dates" />
      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
        No due date set
      </Button>
    </div>
  );
}

function LabelsSection() {
  return (
    <div className="space-y-2">
      <SectionLabel icon={Tag} label="Labels" />
      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
        Add labels...
      </Button>
    </div>
  );
}

function TaskInfoBox() {
  return (
    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5" />
        <span className="font-medium uppercase tracking-wider">Metadata</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Task created by <span className="font-medium">Ahmed Lotfy</span>
      </p>
    </div>
  );
}

function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </h3>
  );
}
