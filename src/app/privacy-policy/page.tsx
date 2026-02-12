// src/app/privacy-policy/page.tsx

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-8 my-10 min-h-screen text-slate-800 dark:text-slate-200">
      <h1 className="text-4xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <p className="mb-8 text-slate-500 font-medium">Last Updated: February 12, 2026</p>
      
      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">Data Collection</h2>
          <p>We collect information you provide directly to us via our contact forms, including your name, email, and phone number.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">Google AdSense Disclosure</h2>
          <p>We use Google AdSense to serve ads. Google uses cookies (DART cookies) to serve ads based on your visit to this and other websites. You may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 border-b border-slate-200 pb-2">Contact Us</h2>
          <p>If you have questions about this policy, contact us at info@jumbaglass.co.ke.</p>
        </section>
      </div>
    </main>
  );
}
