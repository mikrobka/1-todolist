import { authActions } from "features/Auth/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { authAPI } from "features/Auth/auth.api";

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export const initializeAppTC = (): AppThunk => (dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
    }

    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  });
};

export type SetAppStatusType = ReturnType<typeof appActions.setStatus>;
export type SetAppErrorType = ReturnType<typeof appActions.setError>;

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
