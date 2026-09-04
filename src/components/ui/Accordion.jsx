import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={item.question}>
            <h3><button type="button" className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-bold" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenIndex(isOpen ? -1 : index)}>{item.question}<FiPlus aria-hidden="true" className={`shrink-0 text-xl text-[var(--color-primary)] transition-transform ${isOpen ? 'rotate-45' : ''}`} /></button></h3>
            <div id={panelId} hidden={!isOpen} className="max-w-3xl pb-6 pr-10 text-[var(--color-muted)]">{item.answer}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Accordion;
