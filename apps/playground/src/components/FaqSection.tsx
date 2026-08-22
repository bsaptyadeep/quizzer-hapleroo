import { useState } from "react";
import { FAQ_ITEMS } from "../content/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="site-section">
      <div className="site-container">
        <header className="site-section-header">
          <span className="site-section-label">Help</span>
          <h2 className="site-section-title">FAQ</h2>
          <p className="site-section-desc">
            Common questions about installing, integrating, and customizing Hapleroo Quizzard.
          </p>
        </header>

        <div className="site-faq-list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={item.question}
                className={`site-faq-item${isOpen ? " is-open" : ""}`}
              >
                <button
                  type="button"
                  className="site-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {item.question}
                  <span className="site-faq-icon" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="site-faq-answer">
                  <div className="site-faq-answer-inner">
                    <p className="site-faq-answer-text">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
