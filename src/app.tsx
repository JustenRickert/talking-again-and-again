import * as React from 'react'
import {compose, Dispatch} from 'redux'
import {connect} from 'react-redux'
import {Tag} from 'en-pos'

import {
  createSentence,
  MessageState,
  SentenceEvent,
  ParagraphEvent,
  UntaggedSentencePayload,
  createParagraph
} from './message'

import {Input} from './input'
import {Robot} from './Robot'

const nouns = 'The word is that dogs are better than cats'.split(' ')

const adjectives = ['smell', 'priest', 'little', 'phony']

interface Props {
  onSendMessage: typeof createSentence
  onSendParagraph: typeof createParagraph
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSendMessage: (p: UntaggedSentencePayload) => dispatch(createSentence(p)),
  onSendParagraph: (ps: {untaggedMessages: UntaggedSentencePayload[]}) =>
    dispatch(createParagraph(ps))
})

interface State {
  userInputValue: string
}

class AppClass extends React.Component<Props, State> {
  readonly state: State = {
    userInputValue: ''
  }

  render() {
    const {userInputValue} = this.state
    return (
      <section>
        <Input
          value={userInputValue}
          onChange={this.handleInputChange}
          onEnter={{
            onSendSentence: this.handleSendMessage,
            onSendParagraph: this.handleSendParagraph
          }}
        />
        <Robot />
      </section>
    )
  }

  handleInputChange = (userInputValue: string) =>
    this.setState({userInputValue})

  handleSendParagraph = (e: ParagraphEvent) => {
    this.setState(_ => {
      this.props.onSendParagraph({
        untaggedMessages: e.sentences.map(({message, ...rest}) => ({
          ...rest,
          singleSentenceMessage: message
        }))
      })
    })
  }

  handleSendMessage = ({message, ...rest}: SentenceEvent) => {
    this.setState(_ => {
      this.props.onSendMessage({
        ...rest,
        singleSentenceMessage: message
      })
      return {userInputValue: ''}
    })
  }
}

export const App = connect(undefined, mapDispatchToProps)(AppClass)
