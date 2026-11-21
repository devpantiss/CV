import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiPhone, FiX } from 'react-icons/fi';

Modal.setAppElement('#root');

const ConsultationModal = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Book a consultation"
    className="modal-content2"
    overlayClassName="modal-overlay"
  >
    <button type="button" onClick={onClose} className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]" aria-label="Close consultation">
      <FiX aria-hidden="true" />
    </button>
    <div className="py-5 sm:px-4">
      <span className="eyebrow">Personal guidance</span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Book a one-to-one consultation.</h2>
      <p className="mt-5 leading-7 text-[var(--color-muted)]">Talk through your interests, compare your options and find a useful next step with our career advisors.</p>
      <Link to="/contact_us" onClick={onClose} className="button button-primary mt-7">Book a conversation <FiArrowRight /></Link>
      <div className="mt-8 grid gap-4 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-primary)]">
        <a className="flex min-h-11 items-center gap-3" href="mailto:divya@thecareervalley.com"><FiMail aria-hidden="true" />divya@thecareervalley.com</a>
        <a className="flex min-h-11 items-center gap-3" href="tel:+918309071632"><FiPhone aria-hidden="true" />+91 8309 071632</a>
      </div>
    </div>
  </Modal>
);

export default ConsultationModal;
