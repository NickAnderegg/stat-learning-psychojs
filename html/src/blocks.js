import { PsychoJS } from '../lib/core-2020.1.js'
import * as core from '../lib/core-2020.1.js'
import { TrialHandler } from '../lib/data-2020.1.js'
import { Scheduler } from '../lib/util-2020.1.js'
import * as util from '../lib/util-2020.1.js'
import * as visual from '../lib/visual-2020.1.js'
import * as sound from '../lib/sound-2020.1.js'

import { psychoJS, sessionInfo } from '../index.js'
import * as exp from './experimentUtils.js'
import * as viz from './viz.js'

export var sentenceList
export var wordList
function loadSentences () {
  sentenceList = new Map()
  wordList = new Map()

  const sentenceListJSON = loadCsvFile(
    'sentences.csv',
    { header: ['sentenceNum', '1', '2', '3', '4', '5', '6', '7', '8'] },
  )

  // eslint-disable-next-line no-unused-vars
  for (const val of Object.values(sentenceListJSON)) {
    const sentenceObject = new Map()

    const onsets = [0]
    const fullSentence = []

    sentenceObject.sentenceNum = val.sentenceNum

    for (var i = 1; i <= 8; i++) {
      if (val[i] === undefined) {
        sentenceObject[i] = ''
      } else {
        val[i] = val[i].replace('.wav', '.mp3')
        sentenceObject[i] = val[i]

        if (!wordList.has(val[i])) {
          wordList[val[i]] = new sound.Sound({
            win: psychoJS.window,
            name: 'word/' + val[i],
            value: 'sounds/words/' + val[i],
          })
        }

        fullSentence.push(val[i].replace('.mp3', ''))

        const lastOnset = onsets[onsets.length - 1]
        const currOnset = lastOnset + wordList[val[i]].getDuration()
        onsets.push(currOnset)
      }
    }

    sentenceObject.audio = new sound.Sound({
      win: psychoJS.window,
      name: 'sentence' + val.sentenceNum,
      value: 'sounds/sentences/sentence' + val.sentenceNum + '.mp3',
    })

    for (var j = 0; j < onsets.length; j++) {
      onsets[j] = (onsets[j]).toFixed(3)
    }
    sentenceObject.onsets = onsets
    sentenceObject.fullSentence = fullSentence
    sentenceObject.fullSentenceJoined = fullSentence.join('/')

    sentenceList[val.sentenceNum] = sentenceObject
  }
}

export var blocksList
function loadBlocksList () {
  blocksList = []

  const blocksListJSON = loadCsvFile('loops.csv')

  for (const val of Object.values(blocksListJSON)) {
    const blockObject = new Map()

    blockObject.blockName = val.block_order.split('.')[0]
    blockObject.monitoredWord = val.monitor
    blockObject.blockOrder = loadBlockOrder(val.block_order)

    blocksList.push(blockObject)
  }
}

const sentenceDigit = /\d+/i
function loadBlockOrder (whichBlock) {
  const blockOrderJSON = loadCsvFile('blocks/' + whichBlock)

  const sentenceOrder = []
  for (const val of Object.values(blockOrderJSON)) {
    sentenceOrder.push(sentenceDigit.exec(val.sentence)[0])
  }

  return sentenceOrder
}

export function loadStimData () {
  loadSentences()
  loadBlocksList()

  return Scheduler.Event.NEXT
}

export function loadCsvFile (whichResource, options) {
  const fileRaw = new Uint8Array(psychoJS.serverManager.getResource(whichResource))
  const fileDecoded = (new TextDecoder()).decode(fileRaw)

  // eslint-disable-next-line no-undef
  const parsedSheet = XLSX.read(fileDecoded, { type: 'string' })

  // eslint-disable-next-line no-undef
  const parsedJSON = XLSX.utils.sheet_to_json(
    parsedSheet.Sheets.Sheet1,
    options
  )

  // for (var i = 0; i < parsedJSON.length; i++) {
  //   for (const [key, val] of Object.entries(parsedJSON[i])) {
  //     if (typeof val === 'string') {
  //       parsedJSON[i][key] = val.trim()
  //     }
  //   }
  // }

  return parsedJSON
}
