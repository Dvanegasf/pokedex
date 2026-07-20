import { createSlice } from "@reduxjs/toolkit";

const pokedex = createSlice({
  name: 'pokedex',
  initialState: {
    paginate: Number(localStorage.getItem('paginate')) || 1,
    search: localStorage.getItem('search') || '',
  },
  reducers: {
    setPaginate: (state, action) => {
      state.paginate = action.payload;
      localStorage.setItem('paginate', action.payload);
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      localStorage.setItem('search', action.payload);
    },
  }
});

export const { setPaginate, setSearch } = pokedex.actions;
export default pokedex.reducer;