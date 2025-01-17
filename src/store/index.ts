import { configureStore } from "@reduxjs/toolkit";
import repo from "./repoSlice"

export const store = configureStore({
    devTools: true,
    reducer: { 
        repo 
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;