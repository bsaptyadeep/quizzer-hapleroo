import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

export function CodeBlock({ code, language = "tsx", showCopy = true }: CodeBlockProps) {
  return (
    <div className="site-code-block">
      <div className="site-code-header">
        <span className="site-code-lang">{language}</span>
        {showCopy && <CopyButton text={code} label="Copy" className="site-btn site-btn-sm site-btn-ghost" />}
      </div>
      <pre className="site-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
