import * as React from 'react'
import {compose} from 'redux'
import {isArray} from 'lodash'

import {SentenceEvent, ParagraphEvent} from './message'

export const Input = ({
  onChange,
  onEnter,
  value
}: {
  onChange: (value: string) => void
  onEnter: {
    onSendSentence: (e: SentenceEvent) => void
    onSendParagraph: (e: ParagraphEvent) => void
  }
  value: string
}) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    onKeyDown={e =>
      !e.shiftKey &&
      (e.key === 'Enter' &&
        parseSentencesAndDispatchThem(e.currentTarget.value.trim(), onEnter))
    }
  />
)

const createSentences = (paragraph: string): string[] => {
  if (!paragraph) {
    return []
  }
  const matchSentence = paragraph.match(/[!?.]/)
  if (matchSentence) {
    return [
      paragraph.slice(0, matchSentence.index) + matchSentence[0],
      ...(matchSentence.index
        ? createSentences(paragraph.slice(matchSentence.index + 1).trimLeft())
        : [])
    ]
  }
  return [paragraph]
}

const createSentenceEvent = (sentence: string): SentenceEvent => {
  const matchPoint = sentence.match(/[!?.]/)
  return {
    message: matchPoint ? sentence.slice(0, matchPoint.index) : sentence,
    isQuestion: Boolean(matchPoint && matchPoint[0] === '?'),
    isExclamation: Boolean(matchPoint && matchPoint[0] === '!')
  }
}

const createParagraphsEvents = (paragraphs: string[]): ParagraphEvent[] =>
  paragraphs.map(createSentences).map(paragraph => ({
    sentences: paragraph.map(createSentenceEvent)
  }))

const parseSentencesAndDispatchThem = (
  s: string,
  onChange: {
    onSendSentence: (e: SentenceEvent) => void
    onSendParagraph: (e: ParagraphEvent) => void
  }
) => {
  if (!s) {
    return
  }
  const paragraphs = createParagraphsEvents(s.split(/\n{2,}/))
  paragraphs.forEach(onChange.onSendParagraph)
}
