import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://twitter-api-jeremytty.sigma-school-full-stack.repl.co";

export const fetchPostsByUser = createAsyncThunk (
    "posts/fetchByUser", //any name
    async (userId) => {
        const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
        return response.json();
    }
);

export const savePost = createAsyncThunk(
"posts/savePost",
async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const data = {
        title: 'Post title',
        content: postContent,
        user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
    }
);

const postsSlice = createSlice({
    // state.posts
    name: 'posts',
    // state.posts.posts or state.posts.loading
    initialState: {posts: [], loading: true},
    // handle sync actions
    reducers: {} ,
    // handle async actions
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        }),
        builder.addCase(savePost.fulfilled, (state, action) => {
            // ADD NEW POST WITH EXISTING POSTS
            state.posts = [action.payload, ...state.posts];
        });
    },
})

export default postsSlice.reducer;