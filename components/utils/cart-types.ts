export interface CartItem {
  id: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}
