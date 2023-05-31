import {ResultCode, TaskType, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setErrorAC, setErrorType, setStatusAC, setStatusType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all',entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all',entityStatus:'idle'}))
        case "SET-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl,entityStatus:action.entityStatus} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const setEntityStatusAC = (id:string,entityStatus:RequestStatusType) => ({type:'SET-ENTITY-STATUS',id,entityStatus} as const )

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setStatusAC('succeeded'))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusAC('loading'))
        dispatch(setEntityStatusAC(todolistId,'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if(res.data.resultCode === ResultCode.OK){
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setStatusAC('succeeded'))
                }else{
                    // @ts-ignore
                    handleServerAppError<{item:TodolistType}>(dispatch,res.data)
                }

            })
            .catch((e)=>{
                handleServerNetworkError(dispatch,e.message)
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if(res.data.resultCode === ResultCode.OK){
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setStatusAC('succeeded'))
                }else{
                    handleServerAppError<{item:TodolistType}>(dispatch,res.data)
                }
            })
            .catch((e) => {
                handleServerNetworkError(dispatch,e.message)
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                if(res.data.resultCode === ResultCode.OK){
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setStatusAC('succeeded'))
                }else{
                    //@ts-ignore
                    handleServerAppError<{item:TodolistType}>(dispatch,res.data)
                }

            })
    }
}

// types

export type setEntityType = ReturnType<typeof setEntityStatusAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | setStatusType
    | setEntityType
    | setErrorType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus:RequestStatusType
}
