"use client"
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, User, Calendar, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <main className="max-w-7xl mt-24 lg:mt-0 mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-sm font-medium mb-6">
          <MessageCircle className="w-4 h-4 mr-2" />
          We&apos;re Here to Help
        </div>
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Have questions about our wellness solutions? We&apos;d love to hear from you. 
          Reach out to us and let&apos;s start your journey to better health together.
        </p>
      </section>

      {/* Contact Information Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Email Us</h3>
          <p className="text-gray-600 text-center mb-4">Send us an email and we&apos;ll respond within 24 hours</p>
          <div className="text-center">
            <a href="mailto:support@amraj.in" className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg">
              care@edaperfumes.com
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-yellow-100">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Call Us</h3>
          <p className="text-gray-600 text-center mb-4">Speak directly with our wellness experts</p>
          <div className="text-center">
            <a href="tel:+919211619009" className="text-yellow-600 hover:text-yellow-700 font-semibold text-lg">
            +91 87997 95681
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Visit Us</h3>
          <p className="text-gray-600 text-center mb-4">Come visit our office for a personal consultation</p>
          <div className="text-center">
            <address className="text-emerald-600 not-italic font-medium text-sm leading-relaxed">
            WZ-11B Ground Floor, Sahib Pura, <br/> 
            Tilak Nagar, New Delhi - 110018
            </address>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gradient-to-br from-emerald-50 to-yellow-50 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Send us a Message</h2>
          <p className="text-gray-600 mb-8">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="consultation">Wellness Consultation</option>
                  <option value="products">Product Information</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Send className="w-4 h-4 inline mr-2" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tell us about your wellness goals or any questions you have..."
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Office Information */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Our Office</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                  <address className="text-gray-600 not-italic leading-relaxed">
                    D5/204, Chintpurni House,<br />
                    Central Market, Prashant Vihar,<br />
                    New Delhi-110085
                  </address>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Business Hours</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Consultation Hours</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>By Appointment Only</p>
                    <p>Call us to schedule your wellness consultation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-emerald-200 to-yellow-200 h-64 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">Find Us Here</h4>
              <p className="text-gray-600">Prashant Vihar, New Delhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-yellow-50 p-10 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-800">How quickly will I receive a response?</h3>
              <p className="text-gray-600">We typically respond to emails within 24 hours and phone calls are answered during business hours.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Do you offer free consultations?</h3>
              <p className="text-gray-600">Yes, we offer free initial consultations to understand your wellness needs and recommend suitable products.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Can I visit your office without an appointment?</h3>
              <p className="text-gray-600">We recommend scheduling an appointment to ensure our wellness experts are available to provide personalized attention.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-800">What information should I include in my inquiry?</h3>
              <p className="text-gray-600">Please include your health goals, any specific concerns, and current wellness routine to help us provide the best recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-emerald-600 to-emerald-700 p-12 rounded-3xl text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
        <p className="text-xl mb-8 text-emerald-100">
          Contact us today and let our experts guide you towards optimal health with personalized solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+919211619009"
            className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg"
          >
            Call Now
          </a>
          <a
            href="mailto:care@amraj.in"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-lg"
          >
            Email Us
          </a>
        </div>
      </section>
    </main>
  );
}