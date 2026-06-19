import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
	name: "feed",
	initialState: null,
	reducers: {
		addFeed: (state, action) => action.payload,
		removeUserFromFeed: (state, action) =>
			state ? state.filter((user) => user._id !== action.payload) : state,
		clearFeed: () => null,
	},
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
