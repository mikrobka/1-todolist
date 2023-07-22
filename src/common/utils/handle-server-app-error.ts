import { Dispatch } from "redux";
import { appActions } from "app/model/app.slice";
import { ResponseType } from "../types";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    debugger;
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
};
