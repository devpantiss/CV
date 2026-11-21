import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import BrandLogo from '../components/ui/BrandLogo';
import ForgotPasswordForm from './Auth/forms/ForgotPasswordForm';
import LoginForm from './Auth/forms/LoginForm';
import OtpValidationForm from './Auth/forms/OtpValidationForm';
import ResetPasswordForm from './Auth/forms/ResetPasswordForm';
import SignupForm from './Auth/forms/SignupForm';

const AuthPage = () => (
  <div className="min-h-screen bg-[var(--color-background)] p-3 md:p-6">
    <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] md:min-h-[calc(100vh-3rem)] lg:grid-cols-[.85fr_1.15fr]">
      <aside className="relative hidden overflow-hidden bg-[var(--color-primary-soft)] p-12 text-[var(--color-foreground)] lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-[var(--color-accent-soft)] opacity-70 blur-3xl" />
        <Link to="/" className="brand-logo-plate relative w-fit" aria-label="Career Valley home"><BrandLogo className="w-[230px]" /></Link>
        <div className="relative max-w-lg"><p className="text-sm font-semibold tracking-wide text-[var(--color-primary)]">Guidance with direction</p><h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-[-.045em]">Keep your guidance journey in one place.</h1><div className="mt-9 grid gap-4 text-sm text-[var(--color-muted)]">{['Register for upcoming education events', 'Return to the courses and colleges you are exploring', 'Use secure account recovery when you need it'].map((item) => <p className="flex items-center gap-3" key={item}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)]"><FiCheck aria-hidden="true" /></span>{item}</p>)}</div></div>
        <p className="relative text-xs text-[var(--color-muted)]">Career Valley · Hyderabad, India</p>
      </aside>
      <main className="flex flex-col p-6 sm:p-10 lg:p-14">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-primary)]"><FiArrowLeft /> Back to website</Link>
        <div className="mx-auto my-auto w-full max-w-lg py-10"><Link to="/" className="brand-logo-plate mb-9 w-fit lg:hidden" aria-label="Career Valley home"><BrandLogo className="w-[220px]" /></Link><Routes><Route index element={<Navigate to="login" replace />} /><Route path="login" element={<LoginForm />} /><Route path="signup" element={<SignupForm />} /><Route path="forgot-password" element={<ForgotPasswordForm />} /><Route path="reset-password/:id/:token" element={<ResetPasswordForm />} /><Route path="validate-otp" element={<OtpValidationForm />} /></Routes></div>
      </main>
    </div>
  </div>
);
export default AuthPage;
