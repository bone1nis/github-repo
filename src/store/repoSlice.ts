import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

import { IRepo } from "../types/types";

interface initialState {
    repoList: IRepo[],
    loadingStatus: string,
    sortBy: string
}

interface fetchResponse {
    incomplete_results: boolean,
    items: IRepo[],
    total_count: number
}


export const fetchRepoList = createAsyncThunk<fetchResponse, number | undefined>(
    "cats/fetchCats",
    async (value = 1, {getState}) => {
        let data;

        const state = getState() as RootState;
        const currentSortBy = state.repo.sortBy;

        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=javascript&sort=${currentSortBy}&limit=20&per_page=20&page=${value}`);

            if (!response.ok) {
                throw new Error(`Could not fetch, status: ${response.status}`);
            }

            data = await response.json();
        } catch(e: unknown) {
            if (e instanceof Error) {
                throw new Error(`HTTP request failed: ${e.message}`);
            } else {
                throw new Error(`Failed`);
            }
        }

        return data;
    }
);

const initialState: initialState = {
    repoList: [],
    loadingStatus: "idle",
    sortBy: "stars"
}


const repoSlice = createSlice({
    name: "repo",
    initialState: initialState,
    reducers: {
        setRepo: (state, action: PayloadAction<IRepo>) => {
            const index = state.repoList.findIndex(repo => repo.id === action.payload.id);

            state.repoList[index] = {...action.payload}
        },
        removeRepo: (state, action: PayloadAction<number>) => {
            state.repoList = state.repoList.filter(repo => repo.id !== action.payload)
        },
        setSortBy: (state, action: PayloadAction<string>) => {
            state.sortBy = action.payload;
            state.repoList = [];
        }
    },
    extraReducers: builder => {
        builder
        .addCase(fetchRepoList.pending, (state) => {
            state.loadingStatus = "loading"
        })
        .addCase(fetchRepoList.fulfilled, (state, action: PayloadAction<fetchResponse>) => {
            const res = action.payload.items;

            const filteredRepo = res.map(repo => {
                return {
                    id: repo.id,
                    full_name: repo.full_name,
                    created_at: repo.created_at,
                    updated_at: repo.updated_at,
                    html_url: repo.html_url
                };
            })

            state.repoList = [...state.repoList, ...filteredRepo]
            state.loadingStatus = "idle"
        })
        .addCase(fetchRepoList.rejected, (state) => {
            state.loadingStatus = "error"
        })
    }
})

const { reducer, actions } = repoSlice;

export default reducer;

export const {
    setRepo,
    removeRepo,
    setSortBy
} = actions;