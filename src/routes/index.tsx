import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Preview</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      line-height: 1.6;
      background: #ffffff;
      color: #1a1a1a;
    }
    h1 { color: #2563eb; }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <div class="card">
    <p>Edit the HTML on the left and press <kbd>Ctrl + Enter</kbd> to update the preview.</p>
  </div>
</body>
</html>`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HTML Tester" },
      { name: "description", content: "Write and preview HTML code instantly." },
      { property: "og:title", content: "HTML Tester" },
      { property: "og:description", content: "Write and preview HTML code instantly." },
    ],
  }),
  component: Index,
});

function Index() {
  const [code, setCode] = useState(DEFAULT_HTML);
  const [preview, setPreview] = useState(DEFAULT_HTML);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = useCallback(() => {
    setPreview(code);
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_HTML);
    setPreview(DEFAULT_HTML);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runCode]);

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      setCode(newValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-primary"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <h1 className="text-lg font-semibold text-foreground">HTML Tester</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetCode}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={runCode}>
            <Play className="mr-1 h-3.5 w-3.5" />
            Run
            <span className="ml-1.5 hidden rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground sm:inline">
              Ctrl+Enter
            </span>
          </Button>
        </div>
      </header>

      {/* Editor + Preview */}
      <Group orientation="horizontal" className="flex-1 min-h-0">
        <Panel defaultSize={50} minSize={20}>
          <div className="dark flex h-full flex-col bg-background text-foreground">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              HTML
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTab}
              className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              style={{ tabSize: 2 }}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="relative flex w-px items-center justify-center bg-border transition-colors hover:bg-ring">
          <div className="rounded-full bg-muted p-1">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={50} minSize={20}>
          <div className="flex h-full flex-col bg-background">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Preview
            </div>
            <iframe
              srcDoc={preview}
              title="HTML Preview"
              className="flex-1 w-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
