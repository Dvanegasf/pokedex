import { configureStore } from "@reduxjs/toolkit";
import trainer from "./slices/trainer.slice";
import pokedex from "./slices/pokedex.slice";

const store = configureStore({
  reducer: {
    trainer,
    pokedex,
  }
});

export default store;