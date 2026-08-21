import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BulletsEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  max?: number;
  placeholder?: string;
}

export function BulletsEditor({ bullets, onChange, max = 4, placeholder = "Describe an outcome or responsibility" }: BulletsEditorProps) {
  function update(i: number, val: string) {
    const next = [...bullets];
    next[i] = val;
    onChange(next);
  }
  function remove(i: number) {
    onChange(bullets.filter((_, idx) => idx !== i));
  }
  function add() {
    if (bullets.length < max) onChange([...bullets, ""]);
  }

  return (
    <div className="space-y-2">
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-slate/50">—</span>
          <input
            value={b}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-md border border-ink-line bg-ink px-3 py-2 text-sm text-slate-bright placeholder:text-slate/50 outline-none focus:border-cobalt/60"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-slate/50 hover:text-danger"
            aria-label="Remove line"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      {bullets.length < max && (
        <Button type="button" variant="ghost" size="sm" onClick={add} className="mt-1">
          <Plus size={13} /> Add line
        </Button>
      )}
    </div>
  );
}