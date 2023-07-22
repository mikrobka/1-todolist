import { appActions, AppInitialStateType, appReducer } from "app/model/app.slice";

let startState: AppInitialStateType;

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  };
});
