import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-soft pb-28 pt-16 lg:pb-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Premium personal food safety, allergen validation, and consumer
            InsurTech scanning — built for everyday vigilance across East Africa
            and beyond.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Allergen engine</li>
            <li>Contaminant detection</li>
            <li>Secure dispatch</li>
            <li>Audit log</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Trust</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Privacy-first</li>
            <li>On-device OCR</li>
            <li>Simulated n8n hooks</li>
            <li>Built with care</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} AllerGuard. All rights reserved.
      </div>
    </footer>
  );
}
