import * as React from 'react'
import {connect} from 'react-redux'
import {toPairs, range} from 'lodash'
import styled from 'styled-components'

import {selectMostRecent, MessageState} from './message'
import {interleave} from './util'

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
          {recentMessages.map(m => {
            const maxLength = Math.min(
              m.posResult.tags.length,
              m.posResult.tokens.length
            )
            return (
              <li>
                {range(maxLength).map(i => (
                  <>
                    <Token children={m.posResult.tokens[i]} />{' '}
                    <Tag children={m.posResult.tags[i]} />
                    {i + 1 === maxLength ? '.' : ' '}
                  </>
                ))}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export const Robot = connect(mapStateToProps)(RobotClass)
