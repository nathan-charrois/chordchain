import evaluate from './evaluate'

function isGuessValid(guess: string, target: number): boolean {
  const value = evaluate(guess)

  if (value === target) {
    console.log('Guess evaluated to', value, 'and matches target', target)
    return true
  }

  return false
}

export default isGuessValid
