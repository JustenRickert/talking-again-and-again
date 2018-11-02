import {Reducer} from 'redux'
import {
  reverse,
  clone,
  isArray,
  pick,
  take,
  takeRight,
  uniqueId,
  last
} from 'lodash'
import {Tag, Result as PosResult} from 'en-pos'

type Sentence = {
  value: string
  posResult: PosResult
  isQuestion: boolean
  isExclamation: boolean
  uniqueId: string
}
type Paragraph = {
  sentences: Sentence[]
  uniqueId: string
}

export interface SentenceEvent {
  message: string
  isQuestion: boolean
  isExclamation: boolean
}

export interface ParagraphEvent {
  sentences: SentenceEvent[]
}

export const SENTENCE = 'MESSAGE_MESSAGE'
export type UntaggedSentencePayload = {
  singleSentenceMessage: string
  isExclamation: boolean
  isQuestion: boolean
}
type SentencePayload = {
  value: string
  posResult: PosResult
  isExclamation: boolean
  isQuestion: boolean
}
interface MessageAction {
  type: typeof SENTENCE
  payload: SentencePayload
}

export const PARAGRAPH = 'MESSAGE_PARAGRAPH'
type ParagraphPayload = {
  sentences: Sentence[]
}
type ParagraphAction = {
  type: typeof PARAGRAPH
  payload: ParagraphPayload
}

export const createSentence = ({
  singleSentenceMessage,
  ...rest
}: UntaggedSentencePayload): MessageAction => ({
  type: SENTENCE,
  payload: {
    ...rest,
    value: singleSentenceMessage,
    posResult: Tag(singleSentenceMessage.split(/\s+/))
  }
})
const reduceSentence = (
  state: MessageState,
  payload: SentencePayload
): MessageState => ({
  ...state,
  history: state.history.length
    ? [...take(state.history, state.history.length - 1), last(state.history)!]
    : [
        {
          sentences: [{...payload, uniqueId: uniqueId('sentenceId')}],
          uniqueId: uniqueId('paragraphId')
        }
      ]
})

export const createParagraph = ({
  untaggedMessages
}: {
  untaggedMessages: UntaggedSentencePayload[]
}): ParagraphAction => ({
  type: PARAGRAPH,
  payload: {
    sentences: untaggedMessages.map(({singleSentenceMessage, ...rest}) => ({
      ...rest,
      value: singleSentenceMessage,
      posResult: Tag(singleSentenceMessage.split(/\s+/)),
      uniqueId: uniqueId('sentenceId')
    }))
  }
})
const reduceParagraph = (state: MessageState, payload: ParagraphPayload) => ({
  ...state,
  history: [...state.history, {...payload, uniqueId: uniqueId('paragraphId')}]
})

export interface MessageState {
  history: Paragraph[]
}
const defaultMessageState = {
  history: []
}

export type MessageStoreAction = MessageAction | ParagraphAction

export const messageReducer: Reducer<MessageState, MessageStoreAction> = (
  state = defaultMessageState,
  action
) => {
  switch (action.type) {
    case PARAGRAPH:
      return reduceParagraph(state, action.payload)
    case SENTENCE:
      return reduceSentence(state, action.payload)
  }
  return state
}

export const selectMostRecent = (
  count: number,
  state: {message: MessageState}
) => reverse(takeRight(state.message.history, count))
