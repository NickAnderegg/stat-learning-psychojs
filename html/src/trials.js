import { PsychoJS } from '../lib/core-2020.1.js'
import * as core from '../lib/core-2020.1.js'
import { TrialHandler } from '../lib/data-2020.1.js'
import { Scheduler } from '../lib/util-2020.1.js'
import * as util from '../lib/util-2020.1.js'
import * as visual from '../lib/visual-2020.1.js'
import * as sound from '../lib/sound-2020.1.js'

import { psychoJS, sessionInfo, viz } from '../index.js'
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
    thisScheduler.add(trialRoutineEachFrame)
    thisScheduler.add(trialRoutineEnd)

    thisScheduler.add(endLoopIteration(thisBlock))
  }

  return Scheduler.Event.NEXT
}

var resp
var respEntry
var trialComponents
var respStream
var checkMatrix
function trialRoutineBegin () {
  resp = new core.BuilderKeyResponse(psychoJS)

  viz.header.setText(
    'Block ' + (blockHandler.thisN + 1) + ':' +
    'Listen carefully to all the words.\n' +
    'Press the down arrow when you hear the word below.'
  )

  viz.targetWordText.setText(monitoredWord)

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

  t = 0
  exp.globalClock.reset()
  exp.routineTimer.reset(10)
  frameN = -1

  return Scheduler.Event.NEXT
}

export function trialLoopEnd () {
  psychoJS.experiment.nextEntry()
  psychoJS.experiment.removeLoop(trials)

  return Scheduler.Event.NEXT
}

function trialRoutineEachFrame () {
  let continueRoutine = true

  t = exp.globalClock.getTime()
  frameN = frameN + 1

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    viz.header.tStart = t
    viz.header.frameNStart = frameN
    viz.header.setAutoDraw(true)

    // infoText.setAutoDraw(true)
    // totalText.setAutoDraw(false)
  }

  if (resp.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    resp.tStart = t
    resp.frameNStart = frameN
    resp.status = PsychoJS.Status.STARTED

    psychoJS.window.callOnFlip(resp.clock.reset)
    psychoJS.eventManager.clearEvents({ eventType: 'keyboard' })
  }

  respEntry = {
    key: undefined,
    keyTimestamp: undefined,
    rt: undefined,
    tStart: t.toFixed(4),
    frameNStart: frameN,
    avgFrameRate: (frameN / t).toFixed(4),
    score: null,
    totalScore: null,
  }

  if (resp.status === PsychoJS.Status.STARTED) {
    let respKeys = psychoJS.eventManager.getKeys({
      keyList: ['1', '2', '3', '4'],
      timeStamped: true
    })

    if (respKeys.indexOf('escape') > -1) {
      psychoJS.experiment.experimentEnded = true
    }
    if (respKeys.length > 0) {
      // console.log(respKeys)
      // console.log('Frame: ' + frameN)
      psychoJS.experiment.nextEntry()
      resp.keys = respKeys[respKeys.length - 1][0]
      resp.timestamp = (respKeys[respKeys.length - 1][1]).toFixed(4)
      resp.rt = resp.clock.getTime().toFixed(4)

      // console.log('rt: ' + resp.rt + ' / timestamp: ' + respKeys[respKeys.length - 1][1])
      // was this 'correct'?
      // if (resp.keys === corrAns) {
      //   resp.corr = 1
      // } else {
      //   resp.corr = 0
      // }
      console.log(resp)
      respEntry.key = resp.keys
      respEntry.keyTimestamp = resp.timestamp
      respEntry.rt = resp.rt

      respStream.push(respEntry)
      exp.addSessionDataObject(respEntry)
      // psychoJS.experiment.nextEntry()
      // exp.patternDetect(respStream, checkMatrix)
      // console.log(respStream)
      // a response ends the routine
      // continueRoutine = false
    }
  }

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
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
  exp.restTimer.reset(10)
  frameN = -1

  infoText.setText('You received ' + trialScore.score + ' points this round.')
  stimulus.setText('XXXXX\nREST') /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */
  totalText.setText('You received ' + totalScore + ' points in total so far.')

  restComponents = []
  restComponents.push(stimulus)
  restComponents.push(infoText)
  restComponents.push(totalText)
  // trialComponents.push(resp)

  // psychoJS.importAttributes({
  //   color: new util.Color([0.32, 0.32, 0.32]),
  // })

  // psychoJS.window.
  // let restColor = new util.Color([0.33, 0.33, 0.33])
  // // document.body.style.backgroundColor = restColor.hex
  // psychoJS.window.color = restColor
  // psychoJS.window._fullRefresh()
  exp.setBackgroundColor(exp.colors.gray)
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

  if (stimulus.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    stimulus.tStart = t
    stimulus.frameNStart = frameN
    stimulus.setAutoDraw(true)

    infoText.setAutoDraw(true)
    totalText.setAutoDraw(true)
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

  trialScore = exp.patternDetect(respStream, checkMatrix)
  exp.scoreList.push(trialScore)

  totalScore = Array.from(exp.scoreList, s => s.score).reduce((accumulator, currentValue) => accumulator + currentValue)

  psychoJS.experiment.addData('score', trialScore.score)
  psychoJS.experiment.addData('totalScore', totalScore)
  psychoJS.experiment.addData('respStream', respStream)
  // psychoJS.experiment.nextEntry()

  // the Routine "trial" was not non-slip safe, so reset the non-slip timer
  exp.routineTimer.reset()

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
