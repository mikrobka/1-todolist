import { ResponseType } from "common/api/common.api";
import { Dispatch } from "redux";
import { appActions, SetAppErrorType, SetAppStatusType } from "app/app-reducer";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorType | SetAppStatusType>
) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setStatus({ status: "failed" }));
};
