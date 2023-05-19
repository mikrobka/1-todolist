import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';
import {combineReducers, legacy_createStore, AnyAction, applyMiddleware} from 'redux';
import {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import thunk from "redux-thunk";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppDispatchType>()

// непосредственно создаём store
export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
