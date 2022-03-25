import {
  configureStore,
  ThunkAction,
  Action,
  createSlice,
} from "@reduxjs/toolkit";

const reducerSlice = createSlice({
  name: "tweetStore",
  initialState: {
    message: "Write your message..",
    userName: "Judd Trump",
    userHandle: "@trumpjudd_147",
    hashTags: ["hash", "tags", "here"],
    deviceName: "iPhone",
    isVerified: false,
  },
  reducers: {
    someAction: function () {},
  },
});

export function makeStore() {
  return configureStore({
    reducer: {
      tweetReducer: reducerSlice.reducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
