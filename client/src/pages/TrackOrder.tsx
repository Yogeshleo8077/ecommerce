import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const TrackOrder: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Track Order</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <p className="text-gray-600 mb-6 text-center">Enter your order ID below to track your package status.</p>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Tracking feature coming soon!'); }}>
          <Input label="Order ID" type="text" placeholder="e.g. ORD-12345" required />
          <Input label="Email Address" type="email" placeholder="Email used for the order" required />
          <Button type="submit" className="w-full">Track Package</Button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrder;
