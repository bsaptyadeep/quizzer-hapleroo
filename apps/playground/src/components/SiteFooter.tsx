export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <div className="site-footer-packages">
          <span className="site-footer-tag">@quiz/core</span>
          <span className="site-footer-tag">@quiz/react</span>
        </div>
        <p className="site-footer-copy">
          Quiz Kit — embeddable quiz engine monorepo. Built for developers who need typed,
          testable quiz logic with a drop-in React UI.
        </p>
      </div>
    </footer>
  );
}
