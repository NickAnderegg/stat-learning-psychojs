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
var comprehensionHandler
export function comprehensionLoopBegin (thisScheduler) {
  console.log('')
  comprehensionHandler = new TrialHandler({
    psychoJS: psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    extraInfo: sessionInfo,
    originPath: undefined,
    trialList: choiceTrialList,
    name: 'choice_trials'
  })

  console.log(comprehensionHandler)
  psychoJS.experiment.addLoop(comprehensionHandler)
  exp.addSessionDataObject(exp.sessionData)

  for (const thisTrial of comprehensionHandler) {
    thisScheduler.add(exp.importConditions(comprehensionHandler))

    thisScheduler.add(comprehensionRoutineBegin)
    thisScheduler.add(comprehensionRoutineIntroFrames)
    thisScheduler.add(comprehensionRoutineEachFrame)
    thisScheduler.add(comprehensionRoutineEnd)

    thisScheduler.add(endLoopIteration(thisTrial))

    console.log('This trial:')
    console.log(thisTrial)
  }

  return Scheduler.Event.NEXT
}

var resp
var trialComponents
var currentTrial
var nextWordStart
function comprehensionRoutineBegin () {
  resp = new core.BuilderKeyResponse(psychoJS)

  viz.header.setText('Listening Comprehension')
  viz.header.setAutoDraw(true)

  trialComponents = [
    viz.header,
    viz.group1Text,
    viz.group2Text,
    resp
  ]

  for (const thisComponent of trialComponents) {
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  t = 0
  exp.globalClock.reset()
  exp.routineTimer.reset(1)
  frameN = -1

  return Scheduler.Event.NEXT
}

var soundSequence
var totalDuration
var rightFragmentZero
var hasResponded
function comprehensionRoutineIntroFrames () {
  if (exp.isWaiting()) {
    return Scheduler.Event.FLIP_REPEAT
  }

  t = exp.globalClock.getTime()

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    viz.header.setAutoDraw(true)
    viz.group1Text.setAutoDraw(true)
    viz.group2Text.setAutoDraw(true)

    console.log('target:')
    console.log(target)
    const onsets = computeOnsets(target, distractor)
    soundSequence = onsets.soundSequence
    totalDuration = onsets.totalDuration
    rightFragmentZero = onsets.rightFragmentZero

    console.log('Onsets:')
    console.log(onsets)
    console.log(soundSequence)

    exp.waitForMS(500)
    return Scheduler.Event.FLIP_REPEAT
  }

  if (exp.isWaiting() || exp.routineTimer.getTime() > 0) {
    return Scheduler.Event.FLIP_REPEAT
  }

  t = 0
  currentTrial = null
  hasResponded = false
  nextWordStart = 0
  exp.globalClock.reset()
  exp.routineTimer.reset(totalDuration)
  frameN = -1

  respEntry = {
      target: targetText,
      distractor: distractorText,
      target_pos: target_position,
      keys: null,
  }

  viz.header.status = PsychoJS.Status.NOT_STARTED
  return Scheduler.Event.NEXT
}

var respEntry
function comprehensionRoutineEachFrame () {
  let continueRoutine = true

  t = exp.globalClock.getTime()
  frameN = frameN + 1

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0) {
    viz.header.tStart = t
    viz.header.frameNStart = frameN
    viz.header.setAutoDraw(true)
    viz.group1Text.setAutoDraw(true)
    viz.group2Text.setAutoDraw(true)
  }

  if (resp.status === PsychoJS.Status.NOT_STARTED && t >= 0) {
    resp.tStart = t
    resp.frameNStart = frameN
    resp.status = PsychoJS.Status.STARTED

    psychoJS.window.callOnFlip(resp.clock.reset)
    psychoJS.eventManager.clearEvents({ eventType: 'keyboard' })

    // currentTrial.stim.status = PsychoJS.Status.STARTED
    // currentTrial.stim.play()
  }

  if (currentTrial === null) {
    currentTrial = soundSequence.shift()
  }

  if (currentTrial.stim.status === PsychoJS.Status.NOT_STARTED && t >= currentTrial.onset) {
    // console.log('Will play word:')
    // console.log(currentTrial)
    // console.log(currentTrial.stim.status)
    psychoJS.window.callOnFlip(playWord, currentTrial)
  } else if (exp.wordDurationCountdown.getTime() < 0 && currentTrial.stim.status === PsychoJS.Status.STARTED) {
    currentTrial.stim.stop()
    if (soundSequence.length > 0) {
      currentTrial = soundSequence.shift()
    }
  }

  if (resp.status === PsychoJS.Status.STARTED) {
    let respKeys = psychoJS.eventManager.getKeys({
      keyList: ['left', 'right'],
      timeStamped: true,
    })

    if (respKeys.indexOf('escape') > -1) {
      psychoJS.experiment.experimentEnded = true
    }

    if (respKeys.length > 0) {
      const thisResp = Object.create({})
      thisResp.key = respKeys[respKeys.length - 1][0]
      thisResp.rt = t

      if (thisResp.key === target_position) {
        thisResp.acc = 1
      } else {
        thisResp.acc = 0
      }

      respEntry = Object.assign(respEntry, thisResp)

      hasResponded = true
      psychoJS.eventManager.clearEvents({ eventType: 'keyboard' })
    }
  }

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
    currentTrial.stim.stop()
    return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false)
  }

  if (exp.routineTimer.getTime() > 0) {
    return Scheduler.Event.FLIP_REPEAT
  } else if (!hasResponded) {
    return Scheduler.Event.FLIP_REPEAT
  } else {
    return Scheduler.Event.NEXT
  }
}

var trialStartTime
var respPoint
function playWord (curr) {
  curr.stim.play()
  exp.wordDurationCountdown.reset(curr.stim.getDuration())
  trialStartTime = (util.MonotonicClock.getReferenceTime()).toFixed(5)
  respPoint = null
}

function computeOnsets (leftFragment, rightFragment) {
  const seq = []

  for (const w of leftFragment) {
    const seqEntry = Object.create({})
    seqEntry.stim = new sound.Sound(w.stim)
    seqEntry.onset = w.fragmentOnset

    seq.push(seqEntry)
    console.log('End after push:')
    console.log(seq[seq.length - 1].stim)
  }

  const rightFragmentZero = seq[seq.length - 1].onset + seq[seq.length - 1].stim.getDuration() + 1

  for (const w of rightFragment) {
    const seqEntry = Object.create({})
    seqEntry.stim = new sound.Sound(w.stim)
    seqEntry.onset = rightFragmentZero + w.fragmentOnset

    seq.push(seqEntry)
  }

  const totalDuration = seq[seq.length - 1].onset + seq[seq.length - 1].stim.getDuration()

  return {
    soundSequence: seq,
    totalDuration: totalDuration,
    rightFragmentZero: rightFragmentZero,
  }
}

function comprehensionRoutineEnd () {
  for (const thisComponent of trialComponents) {
    if (typeof thisComponent.setAutoDraw === 'function') {
      thisComponent.setAutoDraw(false)
    }
  }

  exp.addSessionDataObject(respEntry)
  psychoJS.experiment.nextEntry()

  return Scheduler.Event.NEXT
}

export var choiceTrialList
export function loadTrials () {
  choiceTrialList = []

  const choiceTrialListJSON = blocks.loadCsvFile(
    'comprehension_test.csv'
  )

  console.log(choiceTrialListJSON)

  let trialCount = choiceTrialListJSON.length
  if (trialCount % 2) {
    trialCount += 1
  }

  const positions = []
  for (let i = 0; i < Math.floor(trialCount / 2); i++) {
    positions.push('left')
    positions.push('right')
  }

  // JavaScript doesn't have a shuffle function, so we will
  // implement the Fisher-Yates shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    let t = positions[i]
    positions[i] = positions[j]
    positions[j] = t
  }

  for (const val of Object.values(choiceTrialListJSON)) {
    const trialObject = {}

    trialObject.target = processSeq(val.target)
    trialObject.distractor = processSeq(val.distractor)
    trialObject.target_position = positions.shift()

    trialObject.targetText = val.target
    trialObject.distractorText = val.distractor

    choiceTrialList.push(trialObject)
  }

  console.log(choiceTrialList)

  return Scheduler.Event.NEXT
}

function processSeq (seq) {
  const splitSeq = seq.split('-')
  const wordSeq = []

  for (let i = 0; i < splitSeq.length; i++) {
    const entry = {}
    entry.word = splitSeq[i]

    splitSeq[i] += '.mp3'
    entry.stim = blocks.wordList[splitSeq[i]]
    entry.duration = entry.stim.getDuration()
    entry.fragmentOnset = 0

    if (wordSeq.length > 0) {
      const lastWord = wordSeq[wordSeq.length - 1]
      entry.fragmentOnset = lastWord.fragmentOnset + lastWord.duration
    }

    wordSeq.push(entry)
  }

  return wordSeq
}

export function comprehensionLoopEnd () {
  psychoJS.experiment.nextEntry()
  // psychoJS.experiment.removeLoop(trials)

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
