import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
	name: "feed",
	initialState: null,
	reducers: {
		addFeed: (state, action) => action.payload,
		appendFeed: (state, action) =>
			state ? [...state, ...action.payload] : action.payload,
		removeUserFromFeed: (state, action) =>
			state ? state.filter((user) => user._id !== action.payload) : state,
		clearFeed: () => null,
	},
});

export const { addFeed, appendFeed, removeUserFromFeed, clearFeed } =
	feedSlice.actions;

export default feedSlice.reducer;
