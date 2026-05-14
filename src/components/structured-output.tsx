import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownView } from "@/components/markdown-view";

export function StructuredOutput({
  value,
  onChange,
  placeholder,
  minHeight = "360px",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (!value) {
    return (
      <Textarea
        className="font-mono text-sm"
        style={{ minHeight }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? (
            <><Eye className="mr-1.5 h-4 w-4" /> Preview</>
          ) : (
            <><Pencil className="mr-1.5 h-4 w-4" /> Edit</>
          )}
        </Button>
      </div>
      {editing ? (
        <Textarea
          className="font-mono text-sm"
          style={{ minHeight }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div style={{ minHeight }}>
          <MarkdownView content={value} />
        </div>
      )}
    </div>
  );
}
