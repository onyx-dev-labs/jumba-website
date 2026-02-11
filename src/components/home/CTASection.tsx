"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/actions/contact";
import Button from "../ui/Button";
import { Loader2, MessageSquare } from "lucide-react";

// Fallback for older React versions if useActionState is not available
// but package.json says React 19, so useActionState is correct.

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function CTASection() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // WhatsApp Redirect on Success
  useEffect(() => {
    if (state.success) {
      // Construct WhatsApp Message
      const formData = new FormData(formRef.current!);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const message = formData.get("message");

      const waMessage = `*New Inquiry from Website*
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`;

      const waUrl = `https://wa.me/254721471764?text=${encodeURIComponent(waMessage)}`;
      
      // Open WhatsApp in new tab
      window.open(waUrl, "_blank");
      
      // Reset form
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section className="bg-slate-900 py-20 relative overflow-hidden" id="contact-form">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-white space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-slate-300 text-lg">
              Get a free quote today. Fill out the form or contact us directly on WhatsApp. 
              We deliver quality glass and aluminium solutions tailored to your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <a 
                 href="https://wa.me/254721471764" 
                 target="_blank" 
                 rel="noopener noreferrer"
               >
                 <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none flex items-center gap-2 w-full sm:w-auto justify-center">
                   <MessageSquare size={20} />
                   Chat on WhatsApp
                 </Button>
               </a>
               <a href="mailto:bmlugogo21@gmail.com">
                 <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
                   Email Us Directly
                 </Button>
               </a>
            </div>

            <div className="pt-8 border-t border-slate-800">
               <p className="text-sm text-slate-400">
                 By submitting this form, you agree to our privacy policy. Your details are safe with us.
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Get a Free Quote</h3>
            
            {state.success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start gap-3">
                <div className="mt-1">✅</div>
                <div>
                  <p className="font-bold">Message Sent!</p>
                  <p className="text-sm">We've received your details. WhatsApp is opening now...</p>
                </div>
              </div>
            )}

            {!state.success && state.message && !state.success && (
               <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                 {state.message}
               </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe" 
                  />
                  {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="phone"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="0721 471 764" 
                  />
                  {state.errors?.phone && <p className="text-red-500 text-xs mt-1">{state.errors.phone[0]}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com" 
                />
                {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  name="message" 
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your project..." 
                />
                {state.errors?.message && <p className="text-red-500 text-xs mt-1">{state.errors.message[0]}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
