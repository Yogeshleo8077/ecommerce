import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { type AppDispatch, type RootState } from '../store/store';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { productDetails: product, isLoading, error } = useSelector(
    (state: RootState) => state.product
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          stock: product.stock,
          quantity,
        })
      );
      navigate('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">{error || "We couldn't find the product you're looking for."}</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Button variant="outline" className="mb-8" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="max-w-full h-auto rounded-2xl shadow-sm object-cover max-h-[500px]"
            />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="uppercase tracking-wide text-sm text-primary-600 font-bold mb-2">
              {product.brand || 'Premium Quality'}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* Reviews */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <a href="#reviews" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                {product.numReviews} reviews
              </a>
            </div>

            <div className="text-3xl font-black text-gray-900 mb-6">
              ₹{product.price.toFixed(2)}
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-900">Status</span>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-900">Quantity</span>
                  <select 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
                  >
                    {[...Array(product.stock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0}
                className="w-full py-4 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
