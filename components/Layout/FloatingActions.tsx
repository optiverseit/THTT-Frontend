
import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
      <a 
        href="tel:+9779800000000" 
        className="bg-brand text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform md:hidden flex items-center justify-center"
        aria-label="Call Now"
      >
        <Phone size={24} />
      </a>
      <a 
        href="https://wa.me/9779800000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
        aria-label="WhatsApp Chat"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default FloatingActions;
