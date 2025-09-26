import evaluate from './evaluate'

function isGuessValid(guess: string, target: number): boolean {
  const value = evaluate(guess)
  console.log('Guess evaluated to', value, 'and target is', target)

  return value === target
}

export default isGuessValid
