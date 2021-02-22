import { PsychoJS } from '../lib/core-2021.1.0.js'
import * as core from '../lib/core-2021.1.0.js'
import { TrialHandler } from '../lib/data-2021.1.0.js'
import { Scheduler } from '../lib/util-2021.1.0.js'
import * as util from '../lib/util-2021.1.0.js'
import * as visual from '../lib/visual-2021.1.0.js'
import * as sound from '../lib/sound-2021.1.0.js'

import { psychoJS, sessionInfo, viz, quitPsychoJS } from '../index.js'
import * as exp from './experimentUtils.js'
// import * as viz from './viz.js'
import * as blocks from './blocks.js'

var t
var frameN
var demographicHandler
export function demographicLoopBegin (thisScheduler) {
  console.log('')
  demographicHandler = new TrialHandler({
    psychoJS: psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    extraInfo: sessionInfo,
    originPath: undefined,
    trialList: demographicQuestions,
    name: 'demographic_questions'
  })

  console.log(demographicHandler)
  psychoJS.experiment.addLoop(demographicHandler)
  exp.addSessionDataObject(exp.sessionData)

  for (const thisTrial of demographicHandler) {
    thisScheduler.add(exp.importConditions(demographicHandler))

    thisScheduler.add(demographicRoutineBegin)
    thisScheduler.add(demographicRoutineIntroFrames)
    thisScheduler.add(demographicRoutineEachFrame)
    thisScheduler.add(demographicRoutineEnd)

    thisScheduler.add(endLoopIteration(thisTrial))

    console.log('This trial:')
    console.log(thisTrial)
  }

  return Scheduler.Event.NEXT
}

var questionnaireVisuals
export function prepareQuestionnaireVisuals () {
  let commonQuestionProperties = {
    win: psychoJS.window,
    font: 'Arial',
    units: 'norm',
    text: '',
    wrapWidth: 0.75,
    height: 0.05,
    ori: 0,
    color: new util.Color('black'),
    opacity: 1,
    depth: 99,
    alignHoriz: 'center',
    alignVert: 'center',
    autoDraw: false,
    autoLog: true,
  }

  questionnaireVisuals = []
  var hPos = -0.5
  var vPos = 0.4

  for (var i = 0; i < 16; i++) {
    let viz = {}

    const commonProps = Object.create(commonQuestionProperties)
    const textStimProps = Object.assign(commonProps, {
      name: 'visual/questionnaire_visuals/' + i,
      pos: [hPos, vPos],
    })

    viz.text = new visual.TextStim(textStimProps)

    viz.box = new visual.Rect({
      name: 'questionnaire_option_' + i,
      win: psychoJS.window,
      autoLog: true,
      units: 'norm',
      width: 0.9,
      height: 0.15,
      pos: [hPos, vPos],
      fillColor: new util.Color('#f5f5f5'),
    })

    questionnaireVisuals.push(viz)

    if (i === 7) {
      hPos = 0.5
      vPos = 0.4
    } else {
      vPos -= 0.17
    }
  }

  return Scheduler.Event.NEXT
}

var resp
var trialComponents
var currentTrial
var nextWordStart
function demographicRoutineBegin () {
  // resp = new core.BuilderKeyResponse(psychoJS)
  resp = new core.Mouse({
    name: 'mouse_resp',
    win: psychoJS.window,
    autoLog: true,
  })

  viz.header.setText(question)
  viz.header.setAutoDraw(true)

  trialComponents = [
    viz.header,
    resp
  ]

  for (let i = 0; i < questionnaireVisuals.length; i++) {
    questionnaireVisuals[i].box.setAutoDraw(false)
    questionnaireVisuals[i].text.setAutoDraw(false)
  }

  if (typeof options !== 'undefined') {
    for (let i = 0; i < options.length; i++) {
      questionnaireVisuals[i].box.setAutoDraw(true)
      questionnaireVisuals[i].text.setText(options[i])
      questionnaireVisuals[i].text.setAutoDraw(true)

      // Get the bounding box of the rectangle in pixels
      const obj = questionnaireVisuals[i].box
      const pos_px = util.to_px(obj.pos, 'norm', psychoJS.window)
      const verts = obj._getVertices_px()
      questionnaireVisuals[i].boundingBox = obj._vertices_px.map(v => [v[0] + pos_px[0], v[1] + pos_px[1]])

      trialComponents.push(questionnaireVisuals[i].box)
      trialComponents.push(questionnaireVisuals[i].text)
    }
  }

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

var hasResponded
var lastClick
function demographicRoutineIntroFrames () {
  if (exp.isWaiting()) {
    return Scheduler.Event.FLIP_REPEAT
  }

  t = exp.globalClock.getTime()

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0.1) {
    viz.header.setAutoDraw(true)

    // exp.waitForMS(500)
    return Scheduler.Event.FLIP_REPEAT
  }

  if (exp.isWaiting() || exp.routineTimer.getTime() > 0) {
    return Scheduler.Event.FLIP_REPEAT
  }

  t = 0
  currentTrial = null
  hasResponded = false
  // nextWordStart = 0
  exp.globalClock.reset()
  exp.routineTimer.reset(5)
  frameN = -1
  lastClick = null

  respEntry = {
      option: null,
  }

  viz.header.status = PsychoJS.Status.NOT_STARTED
  return Scheduler.Event.NEXT
}

var respEntry
function demographicRoutineEachFrame () {
  let continueRoutine = true

  t = exp.globalClock.getTime()
  frameN = frameN + 1

  if (viz.header.status === PsychoJS.Status.NOT_STARTED && t >= 0) {
    viz.header.tStart = t
    viz.header.frameNStart = frameN
    viz.header.setAutoDraw(true)
  }

  if (resp.status === PsychoJS.Status.NOT_STARTED && t >= 0) {
    // resp.tStart = t
    // resp.frameNStart = frameN
    resp.status = PsychoJS.Status.STARTED

    // psychoJS.window.callOnFlip(resp.clock.reset)
    psychoJS.eventManager.clearEvents({ eventType: 'keyboard' })

    // currentTrial.stim.status = PsychoJS.Status.STARTED
    // currentTrial.stim.play()
  }

  if (resp.status === PsychoJS.Status.STARTED) {
    let respKeys = psychoJS.eventManager.getKeys({
      timeStamped: true,
    })
    // console.log(respKeys)

    // console.log(resp)
    // return quitPsychoJS('Quitting', false)

    let respPressed = resp.getPressed()

    if (respPressed[0] !== 0) {
      // console.log(respPressed)

      // Convert the click location to pixel position on screen
      lastClick = util.to_px(resp.getPos(), resp.getUnits(), psychoJS.window)
    }

    if (lastClick !== null) {
      for (var i = 0; i < options.length; i++) {
        const inBox = util.IsPointInsidePolygon(lastClick, questionnaireVisuals[i].boundingBox)
        if (inBox) {
          console.log('Is pressed in: ' + questionnaireVisuals[i].box.name)

          respEntry.option = options[i]

          hasResponded = true
        }
      }

      return Scheduler.Event.NEXT
    }

    if (respKeys.indexOf('escape') > -1) {
      psychoJS.experiment.experimentEnded = true
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

function demographicRoutineEnd () {
  for (const thisComponent of trialComponents) {
    if (typeof thisComponent.setAutoDraw === 'function') {
      thisComponent.setAutoDraw(false)
    }
  }

  exp.addSessionDataObject(respEntry)
  psychoJS.experiment.nextEntry()

  return Scheduler.Event.NEXT
}

export var demographicQuestions
export function loadQuestions () {
  demographicQuestions = psychoJS.serverManager.getResource('demographics.json')

  return Scheduler.Event.NEXT
}

export function demographicLoopEnd () {
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
