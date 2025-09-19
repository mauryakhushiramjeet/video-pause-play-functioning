import { createSlice } from "@reduxjs/toolkit";

export interface MediaState {
  videos: string[]|null; 
  song: string | null;
}
export const initialState: MediaState = {
  videos: null,
  song: null,
};
const mediaFileSchema = createSlice({
  name: "mediaFile",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.videos = action.payload;
    },
    setSong: (state, action) => {
      state.song = action.payload;
    },
  },
});
export const { setVideo, setSong } = mediaFileSchema.actions;
export default mediaFileSchema.reducer;
