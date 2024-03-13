import { configureStore } from "@reduxjs/toolkit";
import changeReducer from "../store/slice";

export default configureStore({
  reducer: { changeReducer },
});
