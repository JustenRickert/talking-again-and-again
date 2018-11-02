import * as React from 'react'
import {connect} from 'react-redux'
import {toPairs, range, uniqueId} from 'lodash'
import styled, {keyframes} from 'styled-components'

import {selectMostRecent, MessageState} from './message'
import {interleave} from './util'

const fadein = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const ShiftingLi = styled.li``

const Tag = styled.span`
  color: gray;
  font-size: 12px;
`

const Token = styled.span`
  color: black;
  font-size: 20px;
`

interface Props {
  recentMessages: ReturnType<typeof selectMostRecent>
}

const mapStateToProps = (state: {message: MessageState}) => ({
  recentMessages: selectMostRecent(10, state)
})

class RobotClass extends React.Component<Props> {
  render() {
    const {recentMessages} = this.props
    return (
      <div>
        <ul>
          {recentMessages.map(({sentences}) =>
            sentences.map(
              ({posResult, isExclamation, isQuestion, uniqueId}) => {
                const maxLength = Math.min(
                  posResult.tags.length,
                  posResult.tokens.length
                )
                return (
                  <ShiftingLi>
                    {range(maxLength).map(i => (
                      <>
                        <Token
                          key={`Token-${uniqueId}`}
                          children={posResult.tokens[i]}
                        />{' '}
                        <Tag
                          key={`Tag-${uniqueId}`}
                          children={posResult.tags[i]}
                        />
                        {i + 1 === maxLength
                          ? isExclamation ? '!' : isQuestion ? '?' : '.'
                          : ' '}
                      </>
                    ))}
                  </ShiftingLi>
                )
              }
            )
          )}
        </ul>
      </div>
    )
  }
}

export const Robot = connect(mapStateToProps)(RobotClass)
