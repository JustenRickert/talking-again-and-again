import {Reducer} from 'redux'
import {isArray, pick, takeRight} from 'lodash'
import {Tag, Result} from 'en-pos'

export const MESSAGE = 'MESSAGE_MESSAGE'

export interface NewMessageEvent {
  message: string
  isQuestion: boolean
  isExclamation: boolean
}

interface NewMessageAction {
  type: typeof MESSAGE
  payload: {posResult: Result; isExclamation: boolean; isQuestion: boolean}
}

export const createMessage = ({
  singleSentenceMessage,
  ...rest
}: {
  singleSentenceMessage: string
  isExclamation: boolean
  isQuestion: boolean
}): NewMessageAction => {
  if (/[.?!]/g.test(singleSentenceMessage)) {
    console.log(singleSentenceMessage)
    throw new Error(
      'createMessage doesnt work on multiple sentences, please split them up'
    )
  }
  return {
    type: MESSAGE,
    payload: {
      ...rest,
      posResult: Tag(singleSentenceMessage.split(/ /))
    }
  }
}

type Message = {
  posResult: Result
  isQuestion: boolean
  isExclamation: boolean
}

export interface MessageState {
  history: Message[]
}
const defaultMessageState = {
  history: []
}

export type MessageAction = NewMessageAction

export const messageReducer: Reducer<MessageState, MessageAction> = (
  state = defaultMessageState,
  action
) => {
  switch (action.type) {
    case MESSAGE:
      return {
        ...state,
        history: [...state.history, action.payload]
      }
  }
  return state
}

export const selectMostRecent = (
  count: number,
  state: {message: MessageState}
) => takeRight(state.message.history, count)
