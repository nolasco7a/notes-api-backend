const { palindrome } = require('../utils/for_testing')

test.skip('palidrome of allan', () => {
  const result = palindrome('allan')
  expect(result).toBe('nalla')
})

test.skip('palindrome of emprty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
