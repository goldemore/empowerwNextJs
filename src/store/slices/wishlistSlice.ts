// store/slices/wishlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  ids: number[];
}

const initialState: WishlistState = { 
  ids: [],
};

const wishlistReducer = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<number>) => {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistReducer.actions;
export default wishlistReducer.reducer;
