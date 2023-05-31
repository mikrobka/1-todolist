import {setErrorAC, setErrorType, setStatusAC, setStatusType} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const handleServerNetworkError = (dispatch:Dispatch<ErrorUtilsDispatchType>,error:string) => {
    dispatch(setStatusAC('failed'))
    dispatch(setErrorAC(error))
}

export const  handleServerAppError = <T>(dispatch:Dispatch<ErrorUtilsDispatchType>,data:ResponseType<T>) => {
    if(data.messages.length){
        dispatch(setErrorAC(data.messages[0]))
    }else{
        dispatch(setErrorAC("Some Error"))
    }
    dispatch(setStatusAC('idle'))
}

type ErrorUtilsDispatchType = setStatusType | setErrorType