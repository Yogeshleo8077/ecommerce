import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './Button';

interface PaginateProps {
  pages: number;
  page: number;
  keyword?: string;
}

const Paginate: React.FC<PaginateProps> = ({ pages, page, keyword = '' }) => {
  const [searchParams] = useSearchParams();

  if (pages <= 1) return null;

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    if (keyword) params.set('search', keyword);
    params.set('page', String(pageNumber));
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex justify-center mt-12 gap-2 flex-wrap">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={getPageUrl(x + 1)}
        >
          <Button
            variant={x + 1 === page ? 'primary' : 'outline'}
            className={x + 1 === page ? 'pointer-events-none' : ''}
          >
            {x + 1}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
