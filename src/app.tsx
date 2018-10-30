import * as React from 'react'
import {compose, Dispatch} from 'redux'
import {connect} from 'react-redux'
import {Tag} from 'en-pos'

import {createMessage, MessageState, NewMessageEvent} from './message'

import {Input} from './input'
import {Robot} from './robot'

const nouns = 'The word is that dogs are better than cats'.split(' ')

const adjectives = ['smell', 'priest', 'little', 'phony']

interface Props {
  onSendMessage: typeof createMessage
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSendMessage: (p: {
    singleSentenceMessage: string
    isExclamation: boolean
    isQuestion: boolean
  }) => dispatch(createMessage(p))
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
          onEnter={this.handleSendMessage}
        />
        <Robot />
      </section>
    )
  }

  handleInputChange = (userInputValue: string) =>
    this.setState({userInputValue})

  handleSendMessage = ({message, ...rest}: NewMessageEvent) =>
    this.setState(_ => {
      this.props.onSendMessage({
        ...rest,
        singleSentenceMessage: message
      })
      return {userInputValue: ''}
    })
}

export const App = connect(undefined, mapDispatchToProps)(AppClass)
