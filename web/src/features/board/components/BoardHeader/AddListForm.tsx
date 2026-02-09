import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddListFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function AddListForm({ value, onChange, onSubmit, onCancel, isLoading }: AddListFormProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-zinc-100/50 rounded-xl border border-zinc-100 ring-1 ring-white shadow-sm">
      <Input
        placeholder="List name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
          if (e.key === "Escape") onCancel();
        }}
        className="w-40 h-8 text-sm bg-white border-zinc-200 focus:ring-primary/20"
        autoFocus
        disabled={isLoading}
      />
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="h-8 px-3 rounded-lg shadow-sm shadow-primary/20"
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="h-8 px-2 rounded-lg hover:bg-zinc-200"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
