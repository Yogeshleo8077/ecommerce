import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Contact: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Contact Us</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-12 border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're here to help and answer any question you might have. We look forward to hearing from you.
          </p>
          <div className="space-y-4 text-gray-600">
            <p><strong>Email:</strong> support@antigravityshop.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Innovation Drive, Tech City, TC 90210</p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
          <Input label="Name" type="text" placeholder="Your name" required />
          <Input label="Email" type="email" placeholder="your@email.com" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-4 py-2 border transition-colors duration-200" 
              rows={4} 
              placeholder="How can we help?"
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
