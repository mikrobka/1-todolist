import { Dispatch } from "redux";
import { appActions } from "app/app.slice";
import { ResponseType } from "common/types/common.types";

/**

Handles server application error.
@template D - Type parameter representing the response data type.
@param {ResponseType<D>} data - The response data.
@param {Dispatch} dispatch - The dispatch function from Redux.
@param {boolean} [showError=true] - Optional parameter to control whether to show the error message.
@returns {void}
*/

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setAppStatus({ status: "failed" }));
};
