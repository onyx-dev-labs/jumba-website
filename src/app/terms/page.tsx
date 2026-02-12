// src/app/terms/page.tsx

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto p-8 my-10 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primary">Terms & Conditions</h1>
      <p className="mb-4 text-slate-500 font-medium">Last Updated: February 12, 2026</p>
      
      <div className="space-y-8 text-slate-800 dark:text-slate-200 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">1. Introduction</h2>
          <p>Welcome to Jumba Glass & Aluminium Fabricators. By accessing our website at jumbaglass.co.ke, you agree to be bound by these terms of service and all applicable laws in Kenya.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">2. Intellectual Property</h2>
          <p>Unless otherwise stated, Jumba Glass owns the intellectual property rights for all material on this website. All rights are reserved.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">3. Limitation of Liability</h2>
          <p>In no event shall Jumba Glass be held liable for anything arising out of or in any way connected with your use of this website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">4. Governing Law</h2>
          <p>These terms are governed by the laws of Kenya, and you submit to the exclusive jurisdiction of the courts in Nairobi.</p>
        </section>
      </div>
    </main>
  );
}
