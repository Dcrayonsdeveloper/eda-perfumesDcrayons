'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Sparkles, MessageCircle, Mail } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  productSlug: string;
  productName: string;
}

// FAQ Data for different products
const faqData: Record<string, FAQ[]> = {
  'default': [
    {
      question: "What makes Vyadhihar Foods different from other brands?",
      answer: "Vyadhihar Foods specializes in premium, 100% natural dry fruits and healthy snacks. Our products are lab-tested, handpicked for quality, and contain no preservatives or artificial additives. We source from trusted suppliers and maintain rigorous quality standards at every step."
    },
    {
      question: "Are your products 100% natural?",
      answer: "Yes! All our dry fruits and snacks are completely natural with:\n• No preservatives or artificial colors\n• No added chemicals\n• Lab-tested for purity\n• Carefully sourced and handpicked\n• Packaged to maintain freshness and quality"
    },
    {
      question: "How should I store dry fruits for maximum freshness?",
      answer: "For best results:\n• Store in a cool, dry place away from direct sunlight\n• Keep in airtight containers after opening\n• Avoid exposure to moisture\n• Refrigeration can extend shelf life\n• Most dry fruits last 6-12 months when stored properly"
    },
    {
      question: "Do you offer bulk orders for corporate gifting?",
      answer: "Absolutely! We specialize in premium corporate gifting hampers with:\n• Attractive bulk discounts\n• Custom packaging options\n• Flexible quantity orders\n• Fast nationwide delivery\n• Dedicated customer support\n\nContact us via WhatsApp or email for personalized quotes."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all products. If you're not satisfied for any reason, contact us with proof of purchase for a full refund or replacement. Due to hygiene standards, products must be unopened for returns."
    },
    {
      question: "How long does delivery take?",
      answer: "We deliver across India with:\n• 3-5 working days for most locations\n• Free shipping on orders above ₹999\n• Secure, hygienic packaging\n• Real-time tracking information\n• Special rates for bulk orders"
    },
    {
      question: "Are these products suitable for dietary restrictions?",
      answer: "Our dry fruits are naturally:\n• Vegan-friendly\n• Gluten-free\n• No added sugar (natural sweetness only)\n• Rich in protein and healthy fats\n\nAlways check individual product labels for specific allergen information, especially if you have nut allergies."
    },
    {
      question: "What are the health benefits of your products?",
      answer: "Our premium dry fruits offer:\n• Rich source of vitamins and minerals\n• Natural energy boost\n• Heart-healthy fats\n• Support for immunity\n• Helps in weight management\n• Improves digestion\n• Natural antioxidants"
    }
  ]
};

const defaultFAQs: FAQ[] = faqData['default'];

const ProductFAQ: React.FC<ProductFAQProps> = ({ productSlug, productName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getFAQs = (): FAQ[] => {
    if (faqData[productSlug]) {
      return faqData[productSlug];
    }

    const slugKey = Object.keys(faqData).find(key => 
      productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );

    if (slugKey) {
      return faqData[slugKey];
    }

    return defaultFAQs;
  };

  const faqs = getFAQs();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#FFF8DC] border-t-2 border-[#D4A574]/30 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="py-12 text-center bg-gradient-to-b from-[#FFF8DC] to-white border-b-2 border-[#D4A574]/30">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#C19A6B] text-white px-6 py-2 rounded-full mb-6 shadow-lg">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">Product FAQs</span>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#8B7355] via-[#5D4E37] to-[#8B7355] bg-clip-text text-transparent mb-4 tracking-wide">
          Frequently Asked Questions
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4A574] via-[#C19A6B] to-[#D4A574] mx-auto mb-4 rounded-full shadow-sm"></div>
        <p className="text-[#5D4E37] text-base font-light max-w-2xl mx-auto">
          Everything you need to know about {productName}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-2 border-[#D4A574]/30 rounded-xl overflow-hidden hover:border-[#D4A574] hover:shadow-lg transition-all duration-300 bg-white"
            >
              <button
                className="w-full px-6 py-6 text-left hover:bg-[#FFF8DC] transition-colors focus:outline-none group"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-start gap-6">
                  <h3 className="font-bold text-[#5D4E37] text-base lg:text-lg leading-relaxed flex-1 text-left pr-4 group-hover:text-[#D4A574] transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-full border-2 border-[#D4A574] flex items-center justify-center transition-all duration-300 ${
                      openIndex === index ? 'bg-[#D4A574] rotate-180' : 'bg-white'
                    }`}>
                      <ChevronDownIcon 
                        className={`h-5 w-5 transition-colors ${
                          openIndex === index ? 'text-white' : 'text-[#D4A574]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Answer */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index 
                  ? 'max-h-[1000px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6 pt-0">
                  <div className="bg-gradient-to-br from-[#FFF8DC] to-[#F5DEB3]/30 p-6 border-l-4 border-[#D4A574] rounded-lg">
                    <p className="text-[#5D4E37] text-sm lg:text-base leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-16 text-center border-t-2 border-[#D4A574]/30 mt-8 bg-gradient-to-b from-white to-[#FFF8DC]">
        <div className="max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border-2 border-[#D4A574]/30">
            <MessageCircle className="w-5 h-5 text-[#D4A574]" />
            <span className="text-sm font-semibold text-[#5D4E37]">Need Help?</span>
          </div>
          
          <h3 className="text-2xl font-bold text-[#5D4E37] mb-3 tracking-wide">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 text-base mb-8">
            Our customer care team is here to help you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:care@vyadhiharfoods.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm text-[#5D4E37] border-2 border-[#D4A574] hover:bg-[#FFF8DC] transition-all rounded-full font-bold shadow-md hover:shadow-lg"
            >
              <Mail className="w-5 h-5" />
              <span>Email Support</span>
            </a>
            <a 
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm text-white bg-[#25D366] hover:bg-[#20BA5A] transition-all rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;
