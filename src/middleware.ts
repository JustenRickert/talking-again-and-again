import {Dispatch, Middleware} from 'redux'

import {SENTENCE} from './message'
import {RootState, Action} from './store'

export const messageInterceptor: Middleware<
  Dispatch<Action>,
  RootState
> = store => next => action => {
  if (action.type === SENTENCE) {
    const payload = action
  }
  store.dispatch(action)
}
