import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { JsonTree } from "@/components/json-tree";
import { AdBanner, AdPopup } from "@/components/ad-banner";
import {
  Wand2,
  Minimize2,
  CheckCircle,
  Copy,
  Trash2,
  FileJson,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "page_view" }),
    }).catch(() => { });

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleAdClick = useCallback(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "ad_click" }),
    }).catch(() => { });
  }, []);

  const validateJson = useCallback((text: string): boolean => {
    if (!text.trim()) {
      setError(null);
      setParsedJson(null);
      return false;
    }
    try {
      const parsed = JSON.parse(text);
      setParsedJson(parsed);
      setError(null);
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      setParsedJson(null);
      return false;
    }
  }, []);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "No input",
        description: "Please enter some JSON to format.",
        variant: "destructive",
      });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setParsedJson(parsed);
      setError(null);
      toast({
        title: "Formatted",
        description: "JSON has been prettified successfully.",
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      toast({
        title: "Invalid JSON",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [input, toast]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "No input",
        description: "Please enter some JSON to minify.",
        variant: "destructive",
      });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setParsedJson(parsed);
      setError(null);
      toast({
        title: "Minified",
        description: "JSON has been compressed successfully.",
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      toast({
        title: "Invalid JSON",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [input, toast]);

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      toast({
        title: "No input",
        description: "Please enter some JSON to validate.",
        variant: "destructive",
      });
      return;
    }
    const isValid = validateJson(input);
    if (isValid) {
      toast({
        title: "Valid JSON",
        description: "The JSON is valid and well-formed.",
      });
    } else {
      toast({
        title: "Invalid JSON",
        description: error || "The JSON contains errors.",
        variant: "destructive",
      });
    }
  }, [input, validateJson, error, toast]);

  const handleCopy = useCallback(async () => {
    if (!input.trim()) {
      toast({
        title: "No content",
        description: "Nothing to copy.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(input);
      toast({
        title: "Copied",
        description: "JSON copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  }, [input, toast]);

  const handleClear = useCallback(() => {
    setInput("");
    setParsedJson(null);
    setError(null);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInput(value);
      if (value.trim()) {
        validateJson(value);
      } else {
        setError(null);
        setParsedJson(null);
      }
    },
    [validateJson]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileJson className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">JSON Formatter</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              data-testid="button-clear"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            {/* <Link href="/admin">
              <Button size="icon" variant="ghost" data-testid="link-admin">
                <Lock className="h-4 w-4" />
              </Button>
            </Link> */}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-center py-4 px-4 border-b border-border bg-muted/30">
          <AdBanner position="top" onAdClick={handleAdClick} />
        </div>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-lg font-medium">Input JSON</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={handleFormat}
                      data-testid="button-format"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Format
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleMinify}
                      data-testid="button-minify"
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Minify
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleValidate}
                      data-testid="button-validate"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validate
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCopy}
                      data-testid="button-copy"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <Card className="flex-1 min-h-[400px] overflow-hidden">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder='Paste your JSON here...

Example:
{
  "name": "John",
  "age": 30,
  "active": true
}'
                    className="w-full h-full min-h-[400px] resize-none border-0 focus-visible:ring-0 font-mono text-sm bg-transparent"
                    data-testid="input-json"
                  />
                </Card>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="font-mono break-all">{error}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-medium">Tree View</h2>
                  {parsedJson !== null ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            JSON.stringify(parsedJson, null, 2)
                          );
                          toast({
                            title: "Copied",
                            description: "JSON copied to clipboard.",
                          });
                        } catch {
                          toast({
                            title: "Copy failed",
                            description: "Could not copy to clipboard.",
                            variant: "destructive",
                          });
                        }
                      }}
                      data-testid="button-copy-tree"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>

                <Card className="flex-1 min-h-[400px] overflow-auto">
                  {parsedJson ? (
                    <JsonTree data={parsedJson} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center p-6">
                        <FileJson className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                          Enter valid JSON to see the tree view
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="hidden xl:flex flex-shrink-0">
              <AdBanner position="sidebar" onAdClick={handleAdClick} />
            </div>
          </div>
        </main>

        <div className="flex justify-center py-4 px-4 border-t border-border bg-muted/30">
          <AdBanner position="bottom" onAdClick={handleAdClick} />
        </div>
      </div>

      <footer className="border-t border-border py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <p>JSON Formatter & Viewer</p>
          {/* <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <Link href="/admin">
              <span className="hover:text-foreground transition-colors cursor-pointer">
                Admin
              </span>
            </Link>
          </div> */}
        </div>
      </footer>

      <AdPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onAdClick={handleAdClick}
      />
    </div>
  );
}
