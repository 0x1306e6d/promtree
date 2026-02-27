import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  compact?: boolean;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UrlInput({ onSubmit, compact }: UrlInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (isValidUrl(value)) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="https://example.com/metrics"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9"
        />
      </div>
      <Button
        disabled={!isValidUrl(value)}
        onClick={handleSubmit}
        size={compact ? "sm" : "default"}
      >
        <Search className="h-4 w-4" />
        {!compact && <span>Explore</span>}
      </Button>
    </div>
  );
}
