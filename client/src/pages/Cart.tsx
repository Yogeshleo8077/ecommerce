import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/store';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow lg:w-2/3">
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-24 h-24 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                      <div className="mb-4 sm:mb-0 sm:mr-4">
                        <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-primary-600 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <select 
                            className="bg-transparent text-gray-700 font-medium py-1.5 pl-3 pr-8 rounded-lg focus:ring-primary-500 focus:border-primary-500 border-none outline-none cursor-pointer"
                            value={item.quantity}
                            onChange={(e) => dispatch(addToCart({ ...item, quantity: Number(e.target.value) }))}
                          >
                            {[...Array(item.stock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                Qty: {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={() => handleRemove(item.product)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>₹0.00</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                className="w-full py-4 text-lg shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
