import { describe, test, expect } from 'vitest'
import { isTypeOfRule, Types } from '../isTypeOf.rule'

describe('Is type of rule test', () => {
  const listOfStrings = [
    '',
    ' ',
    'content',
    'true',
    '1'
  ]
  const listOfNumbers = [
    10,
    0,
    0.1,
    0.0
  ]
  const listOfBooleans = [
    true,
    false
  ]

  function testFunction () {

  }

  const listOfFunctions = [
    () => '',
    testFunction
  ]
  const listOfObjects = [
    { with: 'property' },
    {}
  ]
  const listOfArrays = [
    [],
    ['with content']
  ]

  test('Should validate type of string correctly', () => {
    [
      ...listOfObjects,
      ...listOfArrays,
      ...listOfFunctions,
      ...listOfBooleans,
      ...listOfNumbers
    ].forEach(value => expect(isTypeOfRule(value, Types.STRING)).toBe(`${JSON.stringify(value)} is not type of ${Types.STRING}`))

    listOfStrings.forEach(value => expect(isTypeOfRule(value, Types.STRING)).toBe(true))
  })

  test('Should validate type of number correctly', () => {
    [
      ...listOfObjects,
      ...listOfArrays,
      ...listOfFunctions,
      ...listOfBooleans,
      ...listOfStrings
    ].forEach(value => expect(isTypeOfRule(value, Types.NUMBER)).toBe(`${JSON.stringify(value)} is not type of ${Types.NUMBER}`))

    listOfNumbers.forEach(value => expect(isTypeOfRule(value, Types.NUMBER)).toBe(true))
  })

  test('Should validate type of boolean correctly', () => {
    [
      ...listOfObjects,
      ...listOfArrays,
      ...listOfFunctions,
      ...listOfStrings,
      ...listOfNumbers
    ].forEach(value => expect(isTypeOfRule(value, Types.BOOLEAN)).toBe(`${JSON.stringify(value)} is not type of ${Types.BOOLEAN}`))

    listOfBooleans.forEach(value => expect(isTypeOfRule(value, Types.BOOLEAN)).toBe(true))
  })

  test('Should validate type of object correctly', () => {
    [
      ...listOfArrays,
      ...listOfFunctions,
      ...listOfStrings,
      ...listOfNumbers,
      ...listOfBooleans
    ].forEach(value => expect(isTypeOfRule(value, Types.OBJECT)).toBe(`${JSON.stringify(value)} is not type of ${Types.OBJECT}`))

    listOfObjects.forEach(value => expect(isTypeOfRule(value, Types.OBJECT)).toBe(true))
  })

  test('Should validate type of object correctly', () => {
    [
      ...listOfObjects,
      ...listOfFunctions,
      ...listOfStrings,
      ...listOfNumbers,
      ...listOfBooleans
    ].forEach(value => expect(isTypeOfRule(value, Types.ARRAY)).toBe(`${JSON.stringify(value)} is not type of ${Types.ARRAY}`))

    listOfArrays.forEach(value => expect(isTypeOfRule(value, Types.ARRAY)).toBe(true))
  })
})
