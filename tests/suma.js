const suma = (a, b) => {
  return a - b
}

const checks = [
  { a: 1, b: 2, result: 3 },
  { a: 4, b: 2, result: 6 },
  { a: -2, b: 2, result: 0 }
]

checks.forEach(check => {
  const { a, b, result } = check

  console.assert(
    suma(a, b) === result,
    `${a} + ${b} = ${result}`
  )
})

console.log(`checks performed = ${checks.length}`)
