import { PsychoJS } from '../lib/core-2021.1.0.js'
import * as core from '../lib/core-2021.1.0.js'
import { TrialHandler } from '../lib/data-2021.1.0.js'
import { Scheduler } from '../lib/util-2021.1.0.js'
import * as util from '../lib/util-2021.1.0.js'
import * as visual from '../lib/visual-2021.1.0.js'
import * as sound from '../lib/sound-2021.1.0.js'

import { psychoJS } from '../index.js'
import * as exp from './experimentUtils.js'

let instrText
let instrContinue
let headerText
export function init () {
  headerText = new visual.TextStim({
    win: psychoJS.window,
    name: 'headerText',
    text: 'Volume Test',
    font: 'Arial',
    units: 'height',
    pos: [0, 0.4],
    height: 0.075,
    wrapWidth: 1.25,
    ori: 0,
    color: new util.Color('black'),
    opacity: 1,
    depth: 0.0
  })

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
    height: 0.04,
    color: new util.Color('black'),
    wrapWidth: 1.5
  })

  return Scheduler.Event.NEXT
}

var t
var frameN
var instrComponents
var instructions
var volumeTestAudio
export function loopBegin (thisScheduler) {
  t = 0
  frameN = -1


  const audioTestText = new Map()
  audioTestText.instrBody = [
    'You will hear an audio clip play repeatedly.',
    '\n\nThis is the volume that the experiment will use.',
    'As you listen, adjust your computer volume so that you the audio',
    'is a clear level that is loud, but not so loud that it is uncomfortable.',
    '\n\nPress the SPACE key after you have adjusted the volume to move on to the experiment.'
  ].join(' ')

  instructions = new TrialHandler({
    psychoJS: psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    trialList: [audioTestText],
    name: 'instructions',
    autoLog: false,
  })

  volumeTestAudio = new sound.Sound({
    name: 'volumeTestAudio',
    win: psychoJS.window,
    value: 'volumetest.mp3',
    loops: 2
  })

  // psychoJS.experiment.addLoop(instructions)

  for (const thisInstruction of instructions) {
    thisScheduler.add(exp.importConditions(instructions))
    thisScheduler.add(routineBegin)
    thisScheduler.add(routineFrame)
    thisScheduler.add(routineEnd)
  }

  return Scheduler.Event.NEXT
}

export function routineBegin () {
  instrText.setText(instrBody) /* eslint no-undef: 0 -- Variable is defined by exp.importConditions above */
  instrContinue.setText('When you are ready, press the spacebar to begin.')

  instrComponents = []
  instrComponents.push(instrText)
  instrComponents.push(instrContinue)
  instrComponents.push(headerText)
  instrComponents.push(exp.keyboardHandler)
  instrComponents.push(volumeTestAudio)

  for (const thisComponent of instrComponents) {
    console.log(thisComponent)
    if ('status' in thisComponent) {
      thisComponent.status = PsychoJS.Status.NOT_STARTED
    }
  }

  return Scheduler.Event.NEXT
}

var continueRoutine
var volTestPlaying
var continuedTime
export function routineFrame () {
  let continueRoutine = true

  // frameN++

  if (instrText.status === PsychoJS.Status.NOT_STARTED) {
    // keep track of start time/frame for later
    // instrText.tStart = t // (not accounting for frame time here)
    // instrText.frameNStart = frameN // exact frame index
    instrText.setAutoDraw(true)
    instrContinue.setAutoDraw(true)
    headerText.setAutoDraw(true)

    volTestPlaying = false

  }

  if (exp.keyboardHandler.status === PsychoJS.Status.NOT_STARTED) {
    exp.keyboardHandler.status = PsychoJS.Status.STARTED
  }

  if (exp.keyboardHandler.status === PsychoJS.Status.STARTED) {
    let theseKeys = exp.keyboardHandler.getKeys({
      keyList: ['space'],
      waitRelease: false
    })

    // check for quit:
    if (theseKeys.length > 0 && theseKeys[0].name === 'escape') {
      psychoJS.experiment.experimentEnded = true
      volumeTestAudio.stop()
    }

    if (theseKeys.length > 0) { // at least one key was pressed
      if (volTestPlaying) {
        volumeTestAudio.stop()
        continueRoutine = false

        continuedTime = exp.globalClock.getTime()
        instrText.setAutoDraw(false)
        instrContinue.setAutoDraw(false)
        headerText.setAutoDraw(true)
      } else {
        volumeTestAudio.play()
        volTestPlaying = true
        instrContinue.setText('Press SPACE after you set the volume to a comfortable level.')
      }
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
    volumeTestAudio.stop()
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
  // the Routine "Instructions" was not non-slip safe, so reset the non-slip timer
  // exp.routineTimer.reset()

  return Scheduler.Event.NEXT
}

// export { instrInit, instrRoutineBegin, instrRoutineFrame, instrRoutineEnd, stimulus }
