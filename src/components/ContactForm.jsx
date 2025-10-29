import React, { useState } from 'react';
import emailjs from "emailjs-com";
import { toast } from "sonner"; // or "react-hot-toast"
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

    const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);

  emailjs
    .send(
      "service_g0ha3rs",   // 🔁 replace with your actual service ID
      "template_qyfvlyq",  // 🔁 replace with your actual template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
      "Agp1YqmGfr_zvwkfx"  // 🔁 replace with your public key
    )
    .then(
      (result) => {
        console.log("✅ Email successfully sent!", result.text);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
      },
      (error) => {
        console.error("❌ Email send failed:", error.text);
        toast.error("Failed to send message. Please try again later.");
        setLoading(false);
      }
    );
};

  return (
    <section id="contact" className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch with Fitness Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out directly.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell us more about how we can help..."
              />
            </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-8 py-3 rounded-lg font-medium text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-purple-800"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
          </form>

          <div className="space-y-8">
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-2">
                    Our team will get back to you within 24 hours.
                  </p>
                  <a href="mailto:support@fitnessjourney.com" className="text-primary hover:underline">
                    support@fitnessjourney.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-2">
                    Available Monday to Friday, 9am to 5pm PST.
                  </p>
                  <button className="text-primary hover:underline">
                    Start a conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
