import {combineReducers} from 'redux'
import {userReducer} from './user_reducer'
import { historyReducer } from './history_reducer'

const allReducers = combineReducers({
    user: userReducer,
    history: historyReducer
})

export default allReducers