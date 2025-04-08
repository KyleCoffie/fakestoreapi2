
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  export interface CartState {
    items: CartItem[];
  }
