import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: number;
  size: string;
  quantity: number;
  color:string;
  product_data?: {
    id: number;
    title: string;
    price: number;
    sale_price?: number;
    image: string;
    title_translations?: {
      az?: string;
      en?: string;
    };
  };
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) =>
          item.product === action.payload.product &&
          item.size === action.payload.size
      );
      if (existing) {
        existing.quantity += action.payload.quantity;

        // ✅ обновляем product_data, если есть
        if (action.payload.product_data) {
          existing.product_data = action.payload.product_data;
        }
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.product === action.payload.id &&
            item.size === action.payload.size
          )
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; size: string; type: "i" | "d" }>
    ) => {
      const item = state.items.find(
        (i) => i.product === action.payload.id && i.size === action.payload.size
      );

      if (!item) return;

      if (action.payload.type === "d") {
        if (item.quantity === 1) {
          state.items = state.items.filter(
            (i) => !(i.product === item.product && i.size === item.size)
          );
        } else {
          item.quantity -= 1;
        }
      } else {
        item.quantity += 1;
      }
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
