import { createSlice } from "@reduxjs/toolkit";

const pokedex = createSlice({
  name: 'pokedex',
  initialState: {
    paginate: Number(localStorage.getItem('paginate')) || 1,
  },
  reducers: {
    setPaginate: (state, action) => {
      state.paginate = action.payload;
      localStorage.setItem('paginate', action.payload);
    },
  }
});

export const { setPaginate } = pokedex.actions;
export default pokedex.reducer;