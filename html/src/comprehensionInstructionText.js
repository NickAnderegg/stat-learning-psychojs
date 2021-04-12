import { SEPARATION_DURATION } from './comprehension.js'

const instructionsText = [
  // eslint-disable-next-line no-multi-str
  '\
You will hear two groups of words separated by ' + SEPARATION_DURATION + ' seconds of silence.\
**\
Listen carefully, then choose which of these forms a better group \
in the language you just heard.\
',
]

function processBodyText (text) {
  var lines = []

  for (let line of text.split('**')) {
    line = line.replace('\n', ' ')
    line = '‣  ' + line
    lines.push(line)
  }

  return lines.join('\n\n')
}

export function generateInstructions () {
  const instructions = []
  for (const screen of instructionsText) {
    const instrObject = new Map()

    instrObject.instrBody = processBodyText(screen)

    instructions.push(instrObject)
  }

  return instructions
}
