import React,{ useState } from 'react';
import { Check,Copy,Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  expectedOutput?: string;
  lineExplanations?: Record<number, string>;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  expectedOutput,
  lineExplanations,
  title
}) => {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-dark-border bg-dark-bg my-4 shadow-lg text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-surface border-b border-dark-border/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 ml-2">
            {title || language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {expectedOutput && (
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-dark-surface2 text-accent-purple-light hover:bg-accent-purple/20 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              {showOutput ? 'Hide Output' : 'View Output'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-dark-surface2 text-slate-300 hover:text-white hover:bg-dark-border transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto font-mono text-[13px] leading-relaxed select-text">
        <pre className="text-slate-200">
          <code>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const hasExplanation = lineExplanations && lineExplanations[lineNum];
              return (
                <div
                  key={idx}
                  className={`flex items-start group ${
                    hasExplanation ? 'bg-accent-purple/10 -mx-4 px-4 py-0.5 rounded' : ''
                  }`}
                >
                  <span className="w-8 text-right pr-4 text-slate-600 select-none text-xs flex-shrink-0 pt-0.5">
                    {lineNum}
                  </span>
                  <span className="flex-1 whitespace-pre">{line || ' '}</span>
                  {hasExplanation && (
                    <span className="text-xs text-accent-purple-light ml-4 opacity-0 group-hover:opacity-100 transition-opacity italic">
                      💡 {hasExplanation}
                    </span>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Expected Output Drawer */}
      {expectedOutput && showOutput && (
        <div className="border-t border-dark-border bg-dark-bg p-3 text-xs font-mono">
          <div className="text-slate-400 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-accent-green-light" />
            <span className="font-semibold text-accent-green-light">Standard Output (Simulated):</span>
          </div>
          <pre className="text-emerald-300/90 whitespace-pre-wrap pl-4 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
            {expectedOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
