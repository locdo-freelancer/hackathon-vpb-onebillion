import React from "react";

interface CodeBlockProps {
  code: string;
  language?: "bash" | "powershell" | "javascript" | "typescript" | "json" | "yaml";
  onCopy?: (code: string, buttonId: string) => void;
  buttonId?: string;
  showCopy?: boolean;
  label?: string;
}

/**
 * Shared Code Block Component
 * 
 * Single Responsibility: Renders code block with syntax highlighting
 * Interface Segregation: Flexible props for different use cases
 * Reusability: Can be used for any code display needs
 * 
 * Usage:
 * ```tsx
 * <CodeBlock 
 *   code="npm install package"
 *   language="bash"
 *   onCopy={handleCopy}
 *   showCopy={true}
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "bash",
  onCopy,
  buttonId = "copy-btn",
  showCopy = true,
  label,
}) => {
  const getLanguageLabel = () => {
    if (label) return label;
    
    const labels: Record<string, string> = {
      bash: "Terminal Command",
      powershell: "PowerShell Command",
      javascript: "JavaScript",
      typescript: "TypeScript",
      json: "JSON",
      yaml: "YAML",
    };
    
    return labels[language] || "Code";
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {getLanguageLabel()}
        </span>
        {showCopy && onCopy && (
          <button
            id={buttonId}
            onClick={() => onCopy(code, buttonId)}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            <i className="fas fa-copy mr-1" />
            Copy
          </button>
        )}
      </div>
      <code className="text-sm text-cyan-400 block break-all font-mono">
        {code}
      </code>
    </div>
  );
};
