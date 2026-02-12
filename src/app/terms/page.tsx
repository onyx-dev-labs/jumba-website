// src/app/terms/page.tsx

export default function TermsAndConditions() {
  return (
    <main className="max-w-4xl mx-auto p-8 my-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-cyan-500">Terms & Conditions</h1>
      <p className="mb-4 text-sm">Last Updated: February 12, 2026</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>Welcome to Jumba Glass & Aluminium Fabricators. By accessing our website at jumbaglass.co.ke, you agree to be bound by these terms of service and all applicable laws in Kenya.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Intellectual Property Rights</h2>
          <p>Unless otherwise stated, Jumba Glass and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. User Restrictions</h2>
          <p>You are specifically restricted from: publishing any website material in any other media, selling or sublicensing any website material, or using this website in any way that is damaging to this website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
          <p>In no event shall Jumba Glass, nor any of its officers or employees, be held liable for anything arising out of or in any way connected with your use of this website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </section>
      </div>
    </main>
  );
}
