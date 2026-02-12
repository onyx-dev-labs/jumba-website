// src/app/terms/page.tsx

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto p-8 my-10 min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Terms & Conditions</h1>
      <p className="mb-4 text-slate-600 font-medium">Last Updated: February 12, 2026</p>
      
      <div className="space-y-8 text-slate-800 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">1. Introduction</h2>
          <p>Welcome to Jumba Glass & Aluminium Fabricators. By accessing our website at jumbaglass.co.ke, you agree to be bound by these terms of service and all applicable laws in Kenya.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">2. Intellectual Property Rights</h2>
          <p>Unless otherwise stated, Jumba Glass owns the intellectual property rights for all material on this website. All intellectual property rights are reserved.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">3. User Restrictions</h2>
          <p>You are specifically restricted from: publishing any website material in any other media or using this website in any way that is damaging to this website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">4. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya.</p>
        </section>
      </div>
    </main>
  );
}
