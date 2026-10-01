import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
  persistStore,
  persistReducer,
} from 'redux-persist'

import userReducer from './user/userSlice'

const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key))
  },

  setItem: (key, value) => {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },

  removeItem: (key) => {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
}

const rootReducer = combineReducers({
  user: userReducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)