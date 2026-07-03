import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../store/slices/cartSlice';
import { type RootState } from '../store/store';
import { Button } from '../components/ui/Button';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { shippingAddress, paymentMethod: currentPaymentMethod } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod || 'Razorpay');

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Payment Method</h1>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <legend className="text-base font-medium text-gray-900">Select Method</legend>
            <div className="mt-4 space-y-4">
              
              <div className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setPaymentMethod('Razorpay')}>
                <input
                  id="razorpay"
                  name="paymentMethod"
                  type="radio"
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                  Razorpay (Credit Card / UPI)
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setPaymentMethod('Cash On Delivery')}>
                <input
                  id="cod"
                  name="paymentMethod"
                  type="radio"
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  value="Cash On Delivery"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
                  Cash On Delivery (COD)
                </label>
              </div>

            </div>
          </div>

          <Button type="submit" className="w-full py-4 text-lg mt-8">
            Continue to Place Order
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
