import React from 'react';

const Returns: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Returns & Exchanges</h1>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-gray-600 leading-relaxed border border-gray-100">
        <p>We want you to be completely satisfied with your purchase. If you are not entirely happy, we're here to help.</p>
        
        <h2 className="text-2xl font-bold text-gray-900">Returns</h2>
        <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        
        <h2 className="text-2xl font-bold text-gray-900">Refunds</h2>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your credit card (or original method of payment).</p>
        
        <h2 className="text-2xl font-bold text-gray-900">Shipping for Returns</h2>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
      </div>
    </div>
  );
};

export default Returns;
