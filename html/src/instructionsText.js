
const instructionsText = [
  // eslint-disable-next-line no-multi-str
  '\
In this task, you will be asked to listen to sequences of sounds and \
press a button when you hear a certain sound in the sequence. \
**\
The sequences you hear will be made-up “words” arranged into sentences.\
**\
You will listen to 36 blocks of sentences with rest blocks in between.\
**\
Please ensure that this window is fullscreen.\
',
  // eslint-disable-next-line no-multi-str
  '\
At the beginning of each sentence block, you will see a \
"word" written on the screen and you will hear it played once.\
**\
When the block begins, listen carefully to all the words.\
**\
When you hear the word on the screen, press the down arrow \
as quickly as you can.\
**\
Please use headphones (in/on both ears) to complete this task.\
',
  // eslint-disable-next-line no-multi-str
  '\
After each sentence block, you will be given a rest. During this time, \
please sit quietly at your computer, keep your eyes on the screen, and do not do anything else.\
**\
On the next block you will be asked to respond to a different word.\
**\
Once you have listened to all the blocks, we will ask you some questions about what you heard.\
',
  // eslint-disable-next-line no-multi-str
  '\
Your learning success does not impact approval of the study, only following the instructions correctly.\
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
