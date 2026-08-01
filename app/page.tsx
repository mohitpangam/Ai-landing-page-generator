import Link from "next/link";
import { SignInButton } from "@/components/auth/SignInButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-base text-text-primary">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-base/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white text-base font-extrabold">
              AI
            </span>
            <span>LandingGen</span>
          </div>

          <nav className="flex items-center gap-4">
            <SignInButton />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          {/* Eyebrow Label flanked by horizontal rules per Design Doc §2.6 */}
          <div className="flex items-center justify-center gap-3 mb-6 text-text-tertiary font-medium text-xs tracking-widest uppercase">
            <span className="h-[1px] w-8 bg-border-subtle" />
            <span>— AI LANDING PAGE GENERATOR —</span>
            <span className="h-[1px] w-8 bg-border-subtle" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.15] mb-6 text-text-primary">
            Your next landing page, <br className="hidden sm:inline" />
            <span className="italic text-brand-primary font-normal">
              written before your coffee&apos;s ready
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-tertiary max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your product in plain English. Get a fully styled,
            production-quality landing page with real-time visual editing and
            clean Next.js/HTML export.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignInButton className="w-full sm:w-auto px-8 py-6 text-base rounded-lg" />
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 bg-surface-brand border-y border-border-subtle px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-base p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 font-bold text-lg">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Prompt to Page</h3>
              <p className="text-text-tertiary text-sm leading-relaxed">
                Structured JSON schema generation using Google Gemini. Hero,
                features, pricing, and testimonials in under 60 seconds.
              </p>
            </div>

            <div className="bg-surface-base p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 font-bold text-lg">
                🎨
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Editor</h3>
              <p className="text-text-tertiary text-sm leading-relaxed">
                Click-to-edit copy inline, swap theme color swatches, reorder
                sections, and preview across desktop, tablet, and mobile.
              </p>
            </div>

            <div className="bg-surface-base p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 font-bold text-lg">
                📦
              </div>
              <h3 className="text-xl font-semibold mb-2">Clean Export</h3>
              <p className="text-text-tertiary text-sm leading-relaxed">
                Download a clean, ready-to-run Next.js component bundle or static
                HTML/CSS zip — no lock-in or messy output.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 px-6 text-center text-sm text-text-tertiary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AI Landing Page Generator.</p>
          <p>Built with Next.js 15, Tailwind CSS, shadcn/ui & Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}
