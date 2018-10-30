import * as React from 'react'
import {compose} from 'redux'
import {isArray} from 'lodash'

import {NewMessageEvent} from './message'

export const Input = ({
  onChange,
  onEnter,
  value
}: {
  onChange: (value: string) => void
  onEnter: (payload: NewMessageEvent) => void
  value: string
}) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyDown={e =>
      e.key === 'Enter' &&
      dispatchOnPunctuation(e.currentTarget.value.trim(), onEnter)
    }
  />
)

const dispatchOnPunctuation = (
  sentences: string,
  onChange: (e: NewMessageEvent) => void
) => {
  if (!sentences) {
    return
  }
  const matchOnPunctuation = sentences.match(/[.!?]/)
  if (matchOnPunctuation && matchOnPunctuation.index) {
    const message = sentences.slice(0, matchOnPunctuation.index)
    const point = matchOnPunctuation[0]
    const isExclamation = point === '!'
    const isQuestion = point === '?'
    onChange({message, isExclamation, isQuestion})
    dispatchOnPunctuation(
      sentences.slice(matchOnPunctuation.index + 1, sentences.length),
      onChange
    )
    return
  }
  onChange({message: sentences, isQuestion: false, isExclamation: false})
}
