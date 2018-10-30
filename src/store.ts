import {combineReducers, createStore} from 'redux'

import {messageReducer, MessageState, MessageAction} from './message'

export interface RootState {
  message: MessageState
}

const reducer = combineReducers<RootState>({message: messageReducer})

export type Action = MessageAction

export const store = createStore<
  RootState,
  MessageAction,
  undefined,
  undefined
>(reducer)
