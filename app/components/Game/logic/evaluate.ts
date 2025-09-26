import { Parser } from 'expr-eval'

const parser = new Parser({
  operators: {
    add: true,
    subtract: true,
    multiply: true,
    divide: true,
  },
})

function evaluate(input: string): number | null {
  const sanitized = sanitize(input)

  if (sanitized === null) {
    console.error('Input could not be sanitized')
    return null
  }

  try {
    const expression = parser.parse(sanitized)

    if (!/^[0-9.+\-*/()\s]*$/.test(expression.toString())) {
      console.error('Expression contains invalid characters')
      return null
    }

    if (expression.variables().length > 0) {
      console.error('Expression contains variables')
      return null
    }

    const result = expression.evaluate()

    if (!Number.isFinite(result)) {
      console.error('Evaluated expression is not finite')
      return null
    }

    return result
  }
  catch (e) {
    console.error('Expression could not be parsed', e)
    return null
  }
}

function sanitize(guess: string): string {
  return guess
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
}

export default evaluate
