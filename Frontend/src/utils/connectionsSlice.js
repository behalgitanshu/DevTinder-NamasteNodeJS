import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
	name: "connections",
	initialState: null,
	reducers: {
		addConnections: (state, action) => action.payload,
		clearConnections: () => null,
	},
});

export const { addConnections, clearConnections } = connectionsSlice.actions;

export default connectionsSlice.reducer;
