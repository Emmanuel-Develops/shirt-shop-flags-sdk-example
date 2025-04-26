'use client'
import { useProductDetailPageContext } from '../utils/product-detail-page-context';
import { ProductReviews } from './product-reviews';

export function ProductHeader() {
  const { price } = useProductDetailPageContext();
  return (
    <div className="lg:col-span-5 lg:col-start-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium text-gray-900">Circles T-Shirt</h1>
        <p className="text-xl font-medium text-gray-900">{price} NGN</p>
      </div>
      <ProductReviews />
    </div>
  );
}
