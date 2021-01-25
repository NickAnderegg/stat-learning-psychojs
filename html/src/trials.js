import { PsychoJS } from '../lib/core-2020.1.js'
import * as core from '../lib/core-2020.1.js'
import { TrialHandler } from '../lib/data-2020.1.js'
import { Scheduler } from '../lib/util-2020.1.js'
import * as util from '../lib/util-2020.1.js'
import * as visual from '../lib/visual-2020.1.js'
import * as sound from '../lib/sound-2020.1.js'

import { psychoJS, sessionInfo, viz, quitPsychoJS } from '../index.js'
import * as exp from './experimentUtils.js'
// import * as viz from './viz.js'
import * as blocks from './blocks.js'

var t
var frameN
var trials
var continueRoutine
var serverResources
// var currentLoop
var blockHandler
export function trialLoopBegin (thisScheduler) {
  blockHandler = new TrialHandler({
    psychoJS: psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    extraInfo: sessionInfo,
    originPath: undefined,
    trialList: blocks.blocksList,
    name: 'blocks',
  })

  psychoJS.experiment.addLoop(blockHandler)
  exp.addSessionDataObject(exp.sessionData)

  for (const thisBlock of blockHandler) {
    console.log(thisBlock)
    thisScheduler.add(exp.importConditions(blockHandler))

    thisScheduler.add(trialRoutineBegin)
    thisScheduler.add(trialRoutineIntroFrames)
    thisScheduler.add(trialRoutineEachFrame)
    thisScheduler.add(trialRoutineEnd)
    thisScheduler.add(restRoutineBegin)
    thisScheduler.add(restRoutineEachFrame)

    thisScheduler.add(endLoopIteration(thisBlock))
  }

  return Scheduler.Event.NEXT
}

var resp
var trialComponents
var trialSentences
var trialDuration
var respStream
var currentSentence
function trialRoutineBegin () {
  resp = new core.BuilderKeyResponse(psychoJS)

  viz.header.setText(
    'Block ' + (blockHandler.thisIndex + 1) + ': ' +
    'Listen carefully to all the words.\n' +
    'Press the down arrow when you hear the word below.'
  )

  viz.targetWordText.setText(monitoredWord)
  viz.restText.setAutoDraw(false)

  trialComponents = []
  trialComponents.push(viz.header)
  trialComponents.push(viz.targetWordText)
  trialComponents.push(resp)

  exp.setBackgroundColor(new util.Color('#ffffff'))

  respStream = []

  for (const thisComponent of trialComponents) {
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  trialSentences = []
  trialDuration = 0
  for (var i = 0; i < blockOrder.length; i++) {
    // blockOrder[i]
    const nextSentence = blocks.sentenceList[blockOrder[i]]
    nextSentence.audio.status = PsychoJS.Status.NOT_STARTED

    const monitoredWordIndex = nextSentence.fullSentence.indexOf(monitoredWord)
    if (monitoredWordIndex >= 0) {
      nextSentence.monitoredWordPos = monitoredWordIndex
      nextSentence.monitoredWordOnset = nextSentence.onsets[monitoredWordIndex]
    } else {
      nextSentence.monitoredWordPos = null
      nextSentence.monitoredWordOnset = null
    }

    trialSentences.push(nextSentence)

    trialDuration += nextSentence.audio.getDuration()
  }

  t = 0
  currentSentence = null
  exp.globalClock.reset()
  exp.routineTimer.reset(3)
  frameN = -1

  return Scheduler.Event.NEXT
}

let nextPlay
let totalPlays
function trialRoutineIntroFrames () {
  t = exp.globalClock.getTime()
  // frameN = frameN + 1

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    // viz.header.tStart = t
    // viz.header.frameNStart = frameN
    viz.header.setAutoDraw(true)
    viz.targetWordText.setAutoDraw(true)
    blocks.wordList[monitoredWord + '.wav'].play()

    nextPlay = t + blocks.wordList[monitoredWord + '.wav'].getDuration() + 0.25
    totalPlays = 1
  }

  if (t >= nextPlay && totalPlays < 3) {
    blocks.wordList[monitoredWord + '.wav'].play()

    nextPlay = t + blocks.wordList[monitoredWord + '.wav'].getDuration() + 0.25
    totalPlays += 1
  }

  if (totalPlays >= 3 && t > nextPlay) {
    viz.targetWordText.setAutoDraw(false)
  }

  if (exp.routineTimer.getTime() > 0 || totalPlays < 3) {
    return Scheduler.Event.FLIP_REPEAT
  }

  t = 0
  currentSentence = null
  exp.globalClock.reset()
  exp.routineTimer.reset(trialDuration + 1)
  frameN = -1

  viz.header.status = PsychoJS.Status.NOT_STARTED
  return Scheduler.Event.NEXT
}

var allSentenceResponses
var sentenceStartTime
function beginSentence (curr) {
  curr.audio.play()
  exp.sentenceDurationCountdown.reset(currentSentence.audio.getDuration())
  exp.sentenceTimer.reset()
  sentenceStartTime = (util.MonotonicClock.getReferenceTime()).toFixed(5)
  allSentenceResponses = []
}

function recordKeypresses (currentSentence, responses) {
  const pressedWords = []
  let respWithinTarget = null
  let respPrevTarget = null

  let monOnset
  if (currentSentence.monitoredWordOnset !== null) {
    monOnset = currentSentence.monitoredWordOnset
  } else {
    monOnset = -999
  }

  responses.forEach((resp) => {
    if (respWithinTarget === null) {
      if (monOnset - 0.150 <= resp && resp <= parseFloat(monOnset) + 0.760) {
        respWithinTarget = resp
      }
    }

    let prevWord = ''
    for (var i = 0; i < currentSentence.fullSentence.length; i++) {
      const currWord = currentSentence.fullSentence[i]
      const currWordOnset = currentSentence.onsets[i]
      const currWordEnding = currentSentence.onsets[i + 1]

      console.log('currWordOnset: ' + currWordOnset)
      console.log('resp: ' + resp)
      console.log('currWordEnding: ' + currWordEnding)
      if (currWordOnset <= resp && resp < currWordEnding) {
        pressedWords.push({
          timestamp: resp,
          prevWord: prevWord,
          currWord: currWord,
        })
      }

      prevWord = currWord
    }
  })

  return {
    pressedWords: pressedWords,
    respWithinTarget: respWithinTarget,
  }
}

var respEntry
function trialRoutineEachFrame () {
  // TODO: Here is where to continue
  let continueRoutine = true

  t = exp.globalClock.getTime()
  frameN = frameN + 1

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    viz.header.tStart = t
    viz.header.frameNStart = frameN
    viz.header.setAutoDraw(true)
    viz.targetWordText.setAutoDraw(true)
  }

  if (resp.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    resp.tStart = t
    resp.frameNStart = frameN
    resp.status = PsychoJS.Status.STARTED

    psychoJS.window.callOnFlip(resp.clock.reset)
    psychoJS.eventManager.clearEvents({ eventType: 'keyboard' })
  }

  if (currentSentence === null) {
    currentSentence = trialSentences.shift()
  }

  if (currentSentence.audio.status !== PsychoJS.Status.STARTED) {
    respEntry = {
      block_name: blockName,
      sentence_number: currentSentence.sentenceNum,
      sentence: currentSentence.fullSentenceJoined,
      monitored_word: monitoredWord,
      'monitored_word.pos': currentSentence.monitoredWordPos,
      'monitored_word.onset': currentSentence.monitoredWordOnset,
      // 'resp.all': null,
      // tStart: t.toFixed(4),
      // frameNStart: frameN,
      // avgFrameRate: (frameN / t).toFixed(4),
    }

    if (currentSentence.monitoredWordPos === null) {
      respEntry['monitored_word.pos'] = 'None'
      respEntry['monitored_word.onset'] = 'None'
    }

    psychoJS.window.callOnFlip(beginSentence, currentSentence)
  } else if (currentSentence.audio.status === PsychoJS.Status.STOPPED || exp.sentenceDurationCountdown.getTime() <= 0) {
    currentSentence.audio.stop()

    exp.addSessionDataObject(respEntry)
    console.log(respEntry)

    const processedKeypresses = recordKeypresses(currentSentence, allSentenceResponses)

    const allPresses = []
    processedKeypresses.pressedWords.forEach((elem) => {
      const press = elem.timestamp + ':(' + elem.prevWord + ')' + elem.currWord
      allPresses.push(press)
    })
    psychoJS.experiment.addData('resp.all', allPresses.join(';'))

    if (processedKeypresses.respWithinTarget !== null) {
      psychoJS.experiment.addData('resp.within_target_window', processedKeypresses.respWithinTarget)

      const relativeResp = processedKeypresses.respWithinTarget - currentSentence.monitoredWordOnset
      psychoJS.experiment.addData('resp.relative_to_mon_onset', relativeResp)
    } else {
      psychoJS.experiment.addData('resp.within_target_window', 'None')
      psychoJS.experiment.addData('resp.relative_to_mon_onset', 'None')
    }

    console.log(allPresses.join(';'))
    psychoJS.experiment.nextEntry()

    if (trialSentences.length > 0) {
      currentSentence = trialSentences.shift()
    } else {
      // return Scheduler.Event.NEXT
      if (blockHandler.thisTrialN >= 2) {
        return quitPsychoJS('Finished loop', true)
      } else {
        return Scheduler.Event.NEXT
      }
    }
  }

  if (resp.status === PsychoJS.Status.STARTED) {
    let respKeys = psychoJS.eventManager.getKeys({
      keyList: ['down'],
      timeStamped: true
    })

    if (respKeys.indexOf('escape') > -1) {
      psychoJS.experiment.experimentEnded = true
    }

    if (respKeys.length > 0) {
      // console.log(respKeys)
      // console.log('Frame: ' + frameN)
      // psychoJS.experiment.nextEntry()
      resp.keys = respKeys[respKeys.length - 1][0]
      resp.timestamp = (respKeys[respKeys.length - 1][1]).toFixed(5)
      // resp.rt = resp.clock.getTime().toFixed(4)

      resp.rt = (resp.timestamp - sentenceStartTime).toFixed(4)

      // console.log(resp)
      // respEntry.key = resp.keys
      // respEntry.keyTimestamp = resp.timestamp
      // respEntry.rt = resp.rt

      // respStream.push(respEntry)

      allSentenceResponses.push(resp.rt)

      // exp.patternDetect(respStream, checkMatrix)
      console.log(respStream)
      // a response ends the routine
      // continueRoutine = false
    }
  }

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
    currentSentence.audio.stop()
    return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false)
  }

  // check if the Routine should terminate
  if (!continueRoutine) { // a component has requested a forced-end of Routine
    return Scheduler.Event.NEXT
  }

  // continueRoutine = false // reverts to True if at least one component still running
  for (const thisComponent of trialComponents) {
    if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
      continueRoutine = true
      break
    }
  }

  // refresh the screen if continuing
  if (continueRoutine && exp.routineTimer.getTime() > 0) {
    return Scheduler.Event.FLIP_REPEAT
  } else {
    return Scheduler.Event.NEXT
  }
}

let restComponents
let trialScore
function restRoutineBegin () {
  // psychoJS.experiment.nextEntry()

  t = 0
  exp.globalClock.reset()
  exp.restTimer.reset(20)
  frameN = -1

  // infoText.setText('You received ' + trialScore.score + ' points this round.')
  // stimulus.setText('XXXXX\nREST') /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */
  // totalText.setText('You received ' + totalScore + ' points in total so far.')

  viz.header.setAutoDraw(false)
  viz.targetWordText.setAutoDraw(false)

  restComponents = []
  restComponents.push(viz.restText)
  // restComponents.push(stimulus)
  // restComponents.push(infoText)
  // restComponents.push(totalText)
  // trialComponents.push(resp)

  // psychoJS.importAttributes({
  //   color: new util.Color([0.32, 0.32, 0.32]),
  // })

  // psychoJS.window.
  // let restColor = new util.Color([0.33, 0.33, 0.33])
  // // document.body.style.backgroundColor = restColor.hex
  // psychoJS.window.color = restColor
  // psychoJS.window._fullRefresh()
  // exp.setBackgroundColor(exp.colors.gray)
  // respStream = []

  for (const thisComponent of restComponents) {
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  return Scheduler.Event.NEXT
}

function restRoutineEachFrame () {
  let continueRoutine = true

  t = exp.globalClock.getTime()

  if (viz.restText.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    // stimulus.tStart = t
    // stimulus.frameNStart = frameN
    viz.restText.setAutoDraw(true)

    // infoText.setAutoDraw(true)
    // totalText.setAutoDraw(true)
  }

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
    return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false)
  }

  if (!continueRoutine) { // a component has requested a forced-end of Routine
    return Scheduler.Event.NEXT
  }

  // continueRoutine = false // reverts to True if at least one component still running
  for (const thisComponent of trialComponents) {
    if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
      continueRoutine = true
      break
    }
  }

  // refresh the screen if continuing
  if (continueRoutine && exp.restTimer.getTime() > 0) {
    return Scheduler.Event.FLIP_REPEAT
  } else {
    return Scheduler.Event.NEXT
  }
}

let totalScore
function trialRoutineEnd () {
  for (const thisComponent of trialComponents) {
    if (typeof thisComponent.setAutoDraw === 'function') {
      thisComponent.setAutoDraw(false)
    }
  }

  // trialScore = exp.patternDetect(respStream, checkMatrix)
  // exp.scoreList.push(trialScore)

  // totalScore = Array.from(exp.scoreList, s => s.score).reduce((accumulator, currentValue) => accumulator + currentValue)

  // psychoJS.experiment.addData('score', trialScore.score)
  // psychoJS.experiment.addData('totalScore', totalScore)
  // psychoJS.experiment.addData('respStream', respStream)
  // psychoJS.experiment.nextEntry()

  // the Routine "trial" was not non-slip safe, so reset the non-slip timer
  exp.routineTimer.reset()

  return Scheduler.Event.NEXT
}

export function trialLoopEnd () {
  psychoJS.experiment.nextEntry()
  psychoJS.experiment.removeLoop(trials)

  return Scheduler.Event.NEXT
}

function endLoopIteration (thisTrial) {
  // ------Prepare for next entry------
  return function () {
    // if (typeof thisTrial === 'undefined' || !('isTrials' in thisTrial) || thisTrial.isTrials) {
    //   psychoJS.experiment.nextEntry()
    // }
    return Scheduler.Event.NEXT
  }
}
