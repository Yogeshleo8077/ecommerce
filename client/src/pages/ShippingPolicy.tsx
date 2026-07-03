import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Shipping Information</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-gray-600 leading-relaxed border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Domestic Shipping</h2>
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>
        
        <h2 className="text-2xl font-bold text-gray-900">Shipping Rates & Delivery Estimates</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Standard:</strong> 3-5 business days - ₹5.00</li>
          <li><strong>Express:</strong> 2 business days - ₹12.00</li>
          <li><strong>Overnight:</strong> 1 business day - ₹25.00</li>
        </ul>
        <p className="text-sm italic text-gray-500">Free standard shipping on all orders over ₹50!</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">International Shipping</h2>
        <p>We offer international shipping to most countries. Shipping charges for your order will be calculated and displayed at checkout.</p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
