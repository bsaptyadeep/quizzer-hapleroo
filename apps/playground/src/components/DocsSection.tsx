import { useState } from "react";
import { CODE_EXAMPLES, DOC_TABS, type DocTabId } from "../content/codeExamples";
import { CodeBlock } from "./CodeBlock";

export function DocsSection() {
  const [activeTab, setActiveTab] = useState<DocTabId>("react");
  const example = CODE_EXAMPLES[activeTab];

  return (
    <section id="docs" className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Usage</span>
          <h2 className="site-section-title">Documentation</h2>
          <p className="site-section-desc">
            Copy-paste examples for React, the hook, headless engine, and quiz JSON format.
          </p>
        </header>

        <div className="site-tabs" role="tablist" aria-label="Documentation examples">
          {DOC_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`site-tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <CodeBlock code={example.code} language={example.language} />
      </div>
    </section>
  );
}
