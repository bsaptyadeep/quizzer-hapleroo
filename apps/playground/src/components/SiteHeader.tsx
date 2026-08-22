const NAV_ITEMS = [
  { id: "demo", label: "Demo" },
  { id: "docs", label: "Docs" },
  { id: "api", label: "API" },
  { id: "theming", label: "Theming" },
  { id: "faq", label: "FAQ" },
] as const;

interface SiteHeaderProps {
  activeSection: string;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function SiteHeader({ activeSection, onToggleTheme, isDark }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <a href="#" className="site-logo">
          <span className="site-logo-mark">Q</span>
          Quiz Kit
        </a>

        <nav className="site-nav" aria-label="Page sections">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`site-nav-link${activeSection === item.id ? " is-active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header-actions">
          <button
            type="button"
            className="site-btn site-btn-sm site-btn-ghost"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "Light" : "Dark"}
          </button>
          <a href="#demo" className="site-btn site-btn-sm site-btn-primary">
            Try it
          </a>
        </div>
      </div>
    </header>
  );
}

export { NAV_ITEMS };
