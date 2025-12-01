import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JsonTreeNodeProps {
  keyName: string | null;
  value: unknown;
  level: number;
  isLast: boolean;
}

function JsonTreeNode({ keyName, value, level, isLast }: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 2);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  const getValueColor = (val: unknown): string => {
    if (val === null) return "text-orange-500 dark:text-orange-400";
    if (typeof val === "boolean") return "text-purple-600 dark:text-purple-400";
    if (typeof val === "number") return "text-emerald-600 dark:text-emerald-400";
    if (typeof val === "string") return "text-amber-600 dark:text-amber-400";
    return "text-foreground";
  };

  const formatValue = (val: unknown): string => {
    if (val === null) return "null";
    if (typeof val === "string") return `"${val}"`;
    return String(val);
  };

  const renderBrackets = () => {
    if (isArray) return expanded ? "[" : `[...] (${(value as unknown[]).length} items)`;
    if (isObject) return expanded ? "{" : `{...} (${Object.keys(value as object).length} keys)`;
    return "";
  };

  const closingBracket = isArray ? "]" : "}";
  const entries = isObject ? Object.entries(value as object) : [];

  return (
    <div className="font-mono text-sm">
      <div
        className={`flex items-start gap-1 py-0.5 ${isObject ? "cursor-pointer hover-elevate rounded px-1 -mx-1" : ""}`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => isObject && setExpanded(!expanded)}
        data-testid={`json-node-${keyName || "root"}`}
      >
        {isObject && (
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-muted-foreground">
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        )}
        {!isObject && <span className="w-4" />}
        
        {keyName !== null && (
          <>
            <span className="text-sky-600 dark:text-sky-400">"{keyName}"</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        
        {isObject ? (
          <span className="text-muted-foreground">{renderBrackets()}</span>
        ) : (
          <span className={getValueColor(value)}>{formatValue(value)}</span>
        )}
        
        {!isLast && !isObject && <span className="text-muted-foreground">,</span>}
        {!expanded && !isLast && isObject && <span className="text-muted-foreground">,</span>}
      </div>

      {isObject && expanded && (
        <>
          {entries.map(([key, val], idx) => (
            <JsonTreeNode
              key={key}
              keyName={key}
              value={val}
              level={level + 1}
              isLast={idx === entries.length - 1}
            />
          ))}
          <div
            className="text-muted-foreground py-0.5"
            style={{ paddingLeft: `${level * 16}px` }}
          >
            <span className="w-4 inline-block" />
            {closingBracket}
            {!isLast && ","}
          </div>
        </>
      )}
    </div>
  );
}

interface JsonTreeProps {
  data: unknown;
}

export function JsonTree({ data }: JsonTreeProps) {
  return (
    <div className="p-4 overflow-auto" data-testid="json-tree-viewer">
      <JsonTreeNode keyName={null} value={data} level={0} isLast={true} />
    </div>
  );
}
