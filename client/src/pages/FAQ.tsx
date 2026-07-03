import React from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    { q: "How long does shipping take?", a: "Standard shipping usually takes 3-5 business days. International shipping may take 7-14 business days." },
    { q: "Do you accept returns?", a: "Yes, we accept returns within 30 days of purchase. The item must be in its original condition." },
    { q: "How can I track my order?", a: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Apple Pay." }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
