
import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import ServicesStrip from '@/components/Layout/ServicesStrip';
import { services } from '../data/mockData';
const Contact: React.FC = () => {
  return (
    <div>
       <div className={`sticky top-0 z-[60]`}>
          <ServicesStrip />
        </div>
      <section className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <img
    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000"
    alt="Contact Us"
    className="absolute inset-0 w-full h-full object-cover scale-105"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#2D1347]/90 via-[#2D1347]/40 to-slate-50"></div>

  {/* Content */}
  <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
    <span className="inline-block bg-[#D92671] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.4em] mb-6 shadow-xl border border-white/10">
      Get in Touch
    </span>

    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
      Contact Us
    </h1>

    <div className="h-1.5 w-24 bg-[#D92671] mx-auto rounded-full mb-8 shadow-lg"></div>

    <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg italic">
      “Have questions or need assistance? Our team is always ready to help you
      plan your next journey.”
    </p>
  </div>

  {/* Bottom fade */}
  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
</section>


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">Get In Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="bg-brand/5 p-4 rounded-2xl text-brand">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Our Office</h4>
                    <p className="text-slate-500">Kantipath, Kathmandu, Nepal (Near NTB)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  <div className="bg-brand/5 p-4 rounded-2xl text-brand">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Phone & WhatsApp</h4>
                    <p className="text-slate-500">+977 1 4240000 / 9800000000</p>
                    <p className="text-brand font-medium">WhatsApp: +977 9800000000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-brand/5 p-4 rounded-2xl text-brand">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Email Address</h4>
                    <p className="text-slate-500">info@triphimalaya.com.np</p>
                    <p className="text-slate-500">support@triphimalaya.com.np</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-brand/5 p-4 rounded-2xl text-brand">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">Working Hours</h4>
                    <p className="text-slate-500">Sun - Fri: 10:00 AM - 6:00 PM</p>
                    <p className="text-slate-500">Sat: Closed (Available via WhatsApp)</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 rounded-3xl overflow-hidden shadow-xl h-64 bg-slate-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                  [ Google Map Embed Placeholder ]
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3275066927424!2d85.31215167625141!3d27.707122825488117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900388d1d89%3A0xe549b068598970e2!2sKantipath%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-50">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="john@example.com" />
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country Code</label>
                    <input type="number" className="w-20 px-1 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="+977" />
                  </div>
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="9800000000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Services</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20">
                    <option value="">Choose a Service</option>
                    {services.map(service => (
                      <option key={service.id} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                  </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows={6} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/20" placeholder="How can we help you?"></textarea>
                </div>
                <button className="w-full bg-brand text-white py-4 rounded-xl font-bold shadow-lg hover:bg-brand-dark transition-all flex items-center justify-center space-x-2">
                  <Send size={18} />
                  <span>SEND MESSAGE</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
