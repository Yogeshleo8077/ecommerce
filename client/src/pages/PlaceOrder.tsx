import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/ui/Button';
import { type RootState, type AppDispatch } from '../store/store';
import { createOrder, orderReset } from '../store/slices/orderSlice';
import { clearCartItems } from '../store/slices/cartSlice';
const PlaceOrder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cart = useSelector((state: RootState) => state.cart);
  const { order, success, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  useEffect(() => {
    if (success && order) {
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
      dispatch(orderReset());
    }
  }, [navigate, success, order, dispatch]);

  const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = Number(addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)));
  let shippingPrice = itemsPrice > 100 ? 0 : 10;
  if (cart.paymentMethod === 'Cash On Delivery') {
    shippingPrice += 80;
  }
  const taxPrice = Number(addDecimals(Number((0.15 * itemsPrice).toFixed(2))));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Place Order</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Shipping</h2>
            <p className="text-gray-600">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Payment Method</h2>
            <p className="text-gray-600">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.cartItems.map((item, index) => (
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
                <span>₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <Button 
              className="w-full py-4 text-lg" 
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}
            >
              Place Order
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PlaceOrder;
