import { Scheduler } from '../lib/util-2021.1.0.js'
import * as sound from '../lib/sound-2021.1.0.js'

import { psychoJS } from '../index.js'

export const wordStims = {}
export const sentenceStims = {}
export var volumeTest

export function prepareStimuli () {
  const resourcesList = psychoJS.serverManager._resources

  resourcesList.forEach((value, key) => {
    if (key.startsWith('sounds/words/')) {
      let word = key.split('/')[2]
      word = word.split('.')[0]

      prepareWord(word, key)
    } else if (key.startsWith('sounds/sentences/')) {
      let sentence = key.split('/')[2]
      sentence = sentence.split('.')[0]

      prepareSentence(sentence, key)
    }
  })

  volumeTest = new sound.Sound({
    win: psychoJS.window,
    name: 'volumetest',
    value: 'volumetest.mp3',
    autolog: true,
  })

  return Scheduler.Event.NEXT
}

function prepareWord (word, resourceKey) {
  wordStims[word] = new sound.Sound({
    win: psychoJS.window,
    name: 'sounds/words/' + word,
    value: resourceKey,
    autolog: true,
  })
}

function prepareSentence (sentence, resourceKey) {
  sentenceStims[sentence] = new sound.Sound({
    win: psychoJS.window,
    name: 'sounds/sentences/' + sentence,
    value: resourceKey,
    autolog: true,
  })
}
