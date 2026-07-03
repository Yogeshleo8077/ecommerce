import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder } from '../store/slices/orderSlice';
import { type RootState, type AppDispatch } from '../store/store';
import { Button } from '../components/ui/Button';
import api from '../utils/api';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [sdkReady, setSdkReady] = useState(false);

  const { order, isLoading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const addRazorpayScript = async () => {
      try {
        const { data: { key } } = await api.get('/config/razorpay');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
        (window as any).razorpayKey = key;
      } catch (err) {
        console.error('Failed to load Razorpay config', err);
      }
    };

    if (order && !order.isPaid) {
      if (!(window as any).Razorpay) {
        addRazorpayScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [order]);

  if (isLoading) return <div className="text-center py-12">Loading order details...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const handlePayment = () => {
    if (!sdkReady) {
      alert('Payment SDK is loading, please wait...');
      return;
    }

    const options = {
      key: (window as any).razorpayKey,
      amount: Math.round(order.totalPrice * 100),
      currency: 'INR',
      name: 'AntiGravity Ecommerce',
      description: 'Order Payment',
      order_id: order.razorpayOrderId,
      handler: function (response: any) {
        dispatch(payOrder({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })).then(() => {
          dispatch(getOrderDetails(id as string));
        });
      },
      prefill: {
        name: 'Customer',
        email: 'customer@example.com',
      },
      theme: {
        color: '#2563EB',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert('Payment Failed: ' + response.error.description);
    });
    rzp.open();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Order {order._id}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Shipping</h2>
            <p className="mb-4 text-gray-600">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-xl font-medium">Delivered on {order.deliveredAt}</div>
            ) : (
              <div className="bg-amber-100 text-amber-800 p-4 rounded-xl font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Delivery Pending
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Payment Method</h2>
            <p className="mb-4 text-gray-600">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-xl font-medium">Paid on {order.paidAt}</div>
            ) : (
              <div className="bg-amber-100 text-amber-800 p-4 rounded-xl font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Payment Pending
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p>Order is empty</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex items-center">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="ml-4 flex-1">
                      <Link to={`/product/${item.product}`} className="text-primary-600 font-medium hover:underline">
                        {item.name}
                      </Link>
                    </div>
                    <div className="ml-4 text-gray-700">
                      {item.quantity} x ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{order.taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!order.isPaid && order.paymentMethod !== 'Cash On Delivery' && (
              <Button 
                className="w-full py-4 text-lg" 
                onClick={handlePayment}
                disabled={!sdkReady}
              >
                {!sdkReady ? 'Loading Payment Gateway...' : 'Pay Now'}
              </Button>
            )}
            
            {!order.isPaid && order.paymentMethod === 'Cash On Delivery' && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-center font-medium border border-blue-100">
                Please pay ₹{order.totalPrice.toFixed(2)} to the delivery executive upon arrival.
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderDetails;
