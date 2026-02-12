// src/app/privacy-policy/page.tsx

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-8 my-10 min-h-screen bg-white text-slate-800">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">Privacy Policy</h1>
      <p className="mb-8 text-slate-600 font-medium">Last Updated: February 12, 2026</p>
      
      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">Information We Collect</h2>
          <p>We collect information you provide directly to us via our contact forms, including your name, email address, and phone number to better serve your glass fabrication needs.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">Google AdSense Disclosure</h2>
          <p>This website uses Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2 text-slate-900">Contact</h2>
          <p>If you have any questions regarding this policy, please contact us at info@jumbaglass.co.ke.</p>
        </section>
      </div>
    </main>
  );
}
