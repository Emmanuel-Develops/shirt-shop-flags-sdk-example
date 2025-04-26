'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export type ProductDetailPageContextType = {
  color: string;
  size: string;
  price: number;
  setColor: (color: string) => void;
  setSize: (size: string) => void;
  setPrice: (price: number) => void;
};

export function useProductDetailPageContext(): ProductDetailPageContextType {
  return useContext(ProductDetailPageContext);
}

export const ProductDetailPageContext =
  createContext<ProductDetailPageContextType>({
    color: 'Black',
    size: 'S',
    price: 2000,
    setColor: () => {},
    setSize: () => {},
    setPrice: () => {},
  });

export function ProductDetailPageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState({
    color: 'Black',
    size: 'S',
    price: 2000
  });

  const context = useMemo<ProductDetailPageContextType>(
    () => ({
      color: state.color,
      size: state.size,
      price: state.price,
      setColor: (color: string) => setState((oldState) => ({ ...oldState, color })),
      setSize: (size: string) => setState((oldState) => ({ ...oldState, size })),
      setPrice: (price: number) => setState((oldState) => ({ ...oldState, price })),
    }),
    [state],
  );

  return (
    <ProductDetailPageContext.Provider value={context}>
      {children}
    </ProductDetailPageContext.Provider>
  );
}
