import { PsychoJS } from '../lib/core-2021.1.0.js'
import * as core from '../lib/core-2021.1.0.js'
import { TrialHandler } from '../lib/data-2021.1.0.js'
import { Scheduler } from '../lib/util-2021.1.0.js'
import * as util from '../lib/util-2021.1.0.js'
import * as visual from '../lib/visual-2021.1.0.js'
import * as sound from '../lib/sound-2021.1.0.js'

import { psychoJS } from '../index.js'
import * as exp from './experimentUtils.js'

// import { generateInstructions } from './instructionsText.js'

// const instrScheduler = new Scheduler

let instrText
let instrContinue
let generateInstructions
// export var stimulus
// var respKey
export function init (instrFunction) {
  instrText = new visual.TextStim({
    win: psychoJS.window,
    name: 'instrText',
    text: 'Experiment Instructions.\nPress SPACE key to continue...',
    font: 'Arial',
    units: 'height',
    pos: [0, 0],
    height: 0.045,
    wrapWidth: 1.25,
    ori: 0,
    color: new util.Color('black'),
    opacity: 1,
    depth: 0.0
  })

  instrContinue = new visual.TextStim({
    win: psychoJS.window,
    name: 'instrContinue',
    text: 'Press SPACE key to continue...',
    font: 'Arial',
    units: 'height',
    pos: [0, -0.45],
    height: 0.05,
    color: new util.Color('black')
  })

  generateInstructions = instrFunction

  // resp = new core.BuilderKeyResponse(psychoJS)

  // const instrScheduler = new Scheduler(psychoJS)
  // instrScheduler.add(routineBegin)
  // instrScheduler.add(routineFrame)
  // instrScheduler.add(routineEnd)

  // flowScheduler.add(instrScheduler)

  return Scheduler.Event.NEXT
  // return instrScheduler
}

var t
var frameN
var instrComponents
var instructions
export function loopBegin (thisScheduler) {
  t = 0
  frameN = -1

  // exp.keyboardHandler.keys = undefined
  // exp.keyboardHandler.rt = undefined

  instructions = new TrialHandler({
    psychoJS: psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    trialList: generateInstructions(),
    name: 'instructions',
    autoLog: false,
  })

  // psychoJS.experiment.addLoop(instructions)

  for (const thisInstruction of instructions) {
    thisScheduler.add(exp.importConditions(instructions))
    thisScheduler.add(routineBegin)
    thisScheduler.add(routineFrame)
    thisScheduler.add(routineEnd)

    thisScheduler.add(endLoopIteration(thisInstruction))
  }

  thisScheduler.add(checkComprehensionBegin)
  thisScheduler.add(checkComprehensionFrame, thisScheduler)
  thisScheduler.add(routineEnd)

  return Scheduler.Event.NEXT
}

export function routineBegin () {
  // instrText.setText(instrValue.replace(/\\n/g, '\n')) /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */
  instrText.setText(instrBody) /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */

  instrComponents = []
  instrComponents.push(instrText)
  instrComponents.push(instrContinue)
  instrComponents.push(exp.keyboardHandler)

  for (const thisComponent of instrComponents) {
    console.log(thisComponent)
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  return Scheduler.Event.NEXT
}

var continueRoutine
var instructionLength
var continuationDelayMs
var screenStartTime
var screenContinueTime
export function routineFrame () {
  let continueRoutine = true

  t = exp.globalClock.getTime()

  // frameN++

  if (instrText.status === PsychoJS.Status.NOT_STARTED) {
    // keep track of start time/frame for later
    // instrText.tStart = t // (not accounting for frame time here)
    // instrText.frameNStart = frameN // exact frame index
    instrText.setAutoDraw(true)
    instrContinue.setAutoDraw(true)
    instrContinue.setText('Please wait...')

    instructionLength = (instrBody.split(' ')).length
    continuationDelayMs = 250 * instructionLength
    exp.waitForMS(continuationDelayMs)
  }

  if (exp.keyboardHandler.status === PsychoJS.Status.NOT_STARTED && !exp.isWaiting()) {
    exp.keyboardHandler.status = PsychoJS.Status.STARTED
    instrContinue.setText('Press SPACE key to continue...')
    instrContinue.setAutoDraw(true)
  }

  if (exp.keyboardHandler.status === PsychoJS.Status.STARTED) {
    let theseKeys = exp.keyboardHandler.getKeys({
      keyList: ['space'],
      waitRelease: false
    })

    // check for quit:
    if (theseKeys.length > 0 && theseKeys[0].name === 'escape') {
      psychoJS.experiment.experimentEnded = true
    }

    if (theseKeys.length > 0) { // at least one key was pressed
      continueRoutine = false
    }
  }

  // check for quit (typically the Esc key)
  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
    return psychoJS.quit('The [Escape] key was pressed. Goodbye!', false)
  }

  // check if the Routine should terminate
  if (!continueRoutine) { // a component has requested a forced-end of Routine
    return Scheduler.Event.NEXT
  }

  continueRoutine = false // reverts to True if at least one component still running
  for (const thisComponent of instrComponents) {
    if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
      continueRoutine = true
      break
    }
  }

  // refresh the screen if continuing
  if (continueRoutine) {
    return Scheduler.Event.FLIP_REPEAT
  } else {
    return Scheduler.Event.NEXT
  }
}

export function checkComprehensionBegin () {
  // instrText.setText(instrValue.replace(/\\n/g, '\n')) /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */
  instrText.setText([
    'Do you understand the instructions?\n\n\n',
    '  ‣ If not, press "b" to go back a reread them.\n\n',
    '  ‣ If so, press space to begin the experiment.'
  ].join('')) /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */

  instrComponents = []
  instrComponents.push(instrText)
  instrComponents.push(instrContinue)
  instrComponents.push(exp.keyboardHandler)

  for (const thisComponent of instrComponents) {
    console.log(thisComponent)
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  return Scheduler.Event.NEXT
}

export function checkComprehensionFrame (thisScheduler) {
  let continueRoutine = true

  if (instrText.status === PsychoJS.Status.NOT_STARTED) {
    instrText.setAutoDraw(true)
    instrContinue.setAutoDraw(false)
  }

  if (exp.keyboardHandler.status === PsychoJS.Status.NOT_STARTED && !exp.isWaiting()) {
    exp.keyboardHandler.status = PsychoJS.Status.STARTED
    instrContinue.setAutoDraw(true)
  }

  if (exp.keyboardHandler.status === PsychoJS.Status.STARTED) {
    let theseKeys = exp.keyboardHandler.getKeys({
      keyList: ['space', 'b'],
      waitRelease: false
    })

    // check for quit:
    if (theseKeys.length > 0 && theseKeys[0].name === 'escape') {
      psychoJS.experiment.experimentEnded = true
    }

    if (theseKeys.length > 0) { // at least one key was pressed
      for (const keypress of theseKeys) {
        if (keypress.name === 'b') {
          thisScheduler.add(loopBegin, thisScheduler)
        }
        continueRoutine = false
      }
    }
  }

  if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
    return psychoJS.quit('The [Escape] key was pressed. Goodbye!', false)
  }

  // check if the Routine should terminate
  if (!continueRoutine) { // a component has requested a forced-end of Routine
    return Scheduler.Event.NEXT
  }

  continueRoutine = false // reverts to True if at least one component still running
  for (const thisComponent of instrComponents) {
    if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
      continueRoutine = true
      break
    }
  }

  // refresh the screen if continuing
  if (continueRoutine) {
    return Scheduler.Event.FLIP_REPEAT
  } else {
    return Scheduler.Event.NEXT
  }
}

export function routineEnd () {
  // ------Ending Routine 'Instructions'-------
  for (const thisComponent of instrComponents) {
    if (typeof thisComponent.setAutoDraw === 'function') {
      thisComponent.setAutoDraw(false)
    }
  }
  // psychoJS.experiment.addData('exp.keyboardHandler.keys', exp.keyboardHandler.keys)
  // if (typeof exp.keyboardHandler.keys !== undefined) { // we had a response
  //   psychoJS.experiment.addData('exp.keyboardHandler.rt', exp.keyboardHandler.rt)
  //   exp.routineTimer.reset()
  // }

  exp.keyboardHandler.stop()
  exp.releaseConditions()
  // the Routine "Instructions" was not non-slip safe, so reset the non-slip timer
  // exp.routineTimer.reset()

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

// export { instrInit, instrRoutineBegin, instrRoutineFrame, instrRoutineEnd, stimulus }
