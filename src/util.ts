import {range} from 'lodash'

export const interleave = <A1, A2>(as1: A1[], as2: A2[]): (A1 | A2)[] => {
  const halfLength = Math.min(as1.length, as2.length)
  const arr: (A1 | A2)[] = []
  range(halfLength).forEach(i => {
    arr.push(as1[i])
    arr.push(as2[i])
  })
  return arr
}
