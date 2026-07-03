import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { Button } from './Button';

interface Filters {
  categories: string[];
  brands: string[];
}

export const FilterSidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({ categories: [], brands: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Local state for inputs
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await api.get('/products/filters');
        setFilters(data);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // reset page to 1 on filter change
    params.delete('page');
    setSearchParams(params);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    params.delete('page');
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const keyword = searchParams.get('search');
    if (keyword) params.set('search', keyword);
    setSearchParams(params);
    setMinPrice('');
    setMaxPrice('');
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={clearFilters} className="text-sm font-medium text-primary-600 hover:text-primary-700 hidden sm:block">Clear All</button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="sm:hidden bg-primary-50 text-primary-600 px-3 py-1 rounded-md text-sm font-medium"
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className={`mt-6 space-y-6 ${isOpen ? 'block' : 'hidden'} sm:block`}>
        <div className="sm:hidden flex justify-end">
          <button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-600">Clear Filters</button>
        </div>

      {/* Sort */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Sort By</h4>
        <select 
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
        >
          <option value="">Default</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      {filters.categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Category</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {filters.categories.map(category => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="category"
                  checked={currentCategory === category}
                  onChange={() => updateFilters('category', category)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" 
                />
                <span className="text-gray-600">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {filters.brands.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Brand</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {filters.brands.map(brand => (
              <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="brand"
                  checked={currentBrand === brand}
                  onChange={() => updateFilters('brand', brand)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" 
                />
                <span className="text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <Button onClick={handlePriceApply} className="w-full mt-2" variant="outline" size="sm">
          Apply Price
        </Button>
      </div>
      </div>
    </div>
  );
};
