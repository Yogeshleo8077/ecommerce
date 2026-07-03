import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { Button } from './Button';

export interface Product {
  _id: string;
  name: string;
  images: string[];
  description: string;
  price: number;
  stock: number;
  ratings: number;
  numReviews: number;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group">
      <Link to={`/product/${product._id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 block">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </Link>
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
        </div>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-primary-600 transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-4 flex-grow hidden sm:block">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto gap-1 sm:gap-2">
          <span className="text-sm sm:text-xl font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
          <Button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            size="sm"
            className="whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-sm"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};
