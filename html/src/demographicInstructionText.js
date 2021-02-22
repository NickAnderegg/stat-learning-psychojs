
const instructionsText = [
  // eslint-disable-next-line no-multi-str
  '\
Demographic Questionnaire\
**\
You will now be asked some demographic questions.\
**\
For each question, click on the answer the best answers each question.\
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
