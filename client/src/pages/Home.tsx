import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import Paginate from '../components/ui/Paginate';
import { FilterSidebar } from '../components/ui/FilterSidebar';
import { fetchProducts } from '../store/slices/productSlice';
import { type AppDispatch, type RootState } from '../store/store';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';
  const pageNumber = searchParams.get('page') || '1';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';

  const { products, isLoading, error, page, pages } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ keyword, pageNumber, category, brand, minPrice, maxPrice, sort }));
  }, [dispatch, keyword, pageNumber, category, brand, minPrice, maxPrice, sort]);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section - Hide when searching */}
      {!keyword && (
        <section className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-40"
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
              alt="Store background"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Our Latest Collection
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-gray-300">
              Upgrade your lifestyle with our premium selection of electronics, accessories, and home goods. Handpicked quality for the modern consumer.
            </p>
            <div className="mt-10 flex gap-4">
              <a href="#featured-products">
                <Button size="lg" variant="primary">Shop Now</Button>
              </a>
              <a href="#featured-products">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  View Offers
                </Button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section id="featured-products" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {keyword ? `Search Results for "${keyword}"` : 'Featured Products'}
          </h2>
          {!keyword && (
            <a href="#" className="text-primary-600 hover:text-primary-500 font-medium hidden sm:block">
              View all collections &rarr;
            </a>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
            <p className="font-bold">Error loading products</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
              <FilterSidebar />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No products found matching your search.
                  </div>
                )}
              </div>
              
              {/* Pagination Component */}
              <div className="mt-8">
                <Paginate pages={pages} page={page} keyword={keyword} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
