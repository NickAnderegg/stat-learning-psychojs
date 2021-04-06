/**
 * Sentence Statistical Learning Task (PsychoJS Version)
 *
 * @license
 * Copyright (C) 2020 Nick Anderegg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Import standard PsychoJS library
 */
import { PsychoJS } from './lib/core-2021.1.0.js'
import * as core from './lib/core-2021.1.0.js'
import { TrialHandler } from './lib/data-2021.1.0.js'
import { Scheduler } from './lib/util-2021.1.0.js'
import * as util from './lib/util-2021.1.0.js'
import * as visual from './lib/visual-2021.1.0.js'
import * as sound from './lib/sound-2021.1.0.js'

/**
 * Import experiment-specific files
 */
import * as instr from './src/instructions.js'
import * as audioTest from './src/audioTest.js'
import * as exp from './src/experimentUtils.js'
import * as trials from './src/trials.js'
// import * as viz from './src/viz.js'
import { prepareVisuals } from './src/viz.js'
import * as audioStims from './src/audioStims.js'
import * as blocks from './src/blocks.js'
import * as comprehension from './src/comprehension.js'
import { resourcesList } from './src/resourcesList.js'
import * as demographics from './src/demographics.js'

import * as mainInstructions from './src/instructionsText.js'
import * as comprehensionInstructions from './src/comprehensionInstructionText.js'
import * as demographicInstructions from './src/demographicInstructionText.js'

/**
 * The version of PsychoJS being used. This should always match the version
 * of the libraries being imported in the statements above.
 *
 * @type       {string}
 */
const psychoJSVersion = '2021.1.0'

const runParts = [
  //'instructions',
  //'audioTest',
  //'task',
  'comprehension',
  //'demographics',
]

/**
 * Base PsychoJS object
 *
 * @type       {PsychoJS}
 */
export const psychoJS = new PsychoJS({
  debug: true
})

/**
 * Open an experiment window.
 */
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color('white'),
  units: 'height',
  waitBlanking: true
})

/**
 * The name of the experiment being run. This should be set to the name of
 * the repo slug for clarity.
 *
 * @type       {string}
 */
const expName = 'sentence-stat-learning-psychojs'

/**
 * Create an object to store the participant number and session number.
 *
 * @type       {object.<string, string>}
 */
export let sessionInfo = {
  participant: '',
  session: '1'
}

export const viz = prepareVisuals()

/**
 * Create a GUI prompt to collect participant data
 */
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: sessionInfo,
  title: expName
}))

/**
 * Create the base schedule to run the main loop.
 *
 * This manages scheduled functions which are fired after each frame is displayed.
 *
 * @type       {Scheduler}
 */
const flowScheduler = new Scheduler(psychoJS)

/**
 * Create the scheduler which is triggered if the GUI prompt is cancelled.
 *
 * @type       {Scheduler}
 */
const dialogCancelScheduler = new Scheduler(psychoJS)

/**
 * Create a scheduler to handle responses to the GUI prompt.
 *
 * The signature `scheduleCondition(condition, thenScheduler, elseScheduler)`
 * means that:
 *   - if `condition` returns true, `thenScheduler` will be called;
 *   - if `condition` returns false, then `elseScheduler` is called.
 *
 * In this case, the function in the condition returns true if the dialog
 * response is "OK".
 */
psychoJS.scheduleCondition(
  function () {
    return (psychoJS.gui.dialogComponent.button === 'OK')
  },
  flowScheduler,
  dialogCancelScheduler
)

/* *****************************************************************************
 * Defining the Main Flow of the Experiment
 * *****************************************************************************
 *
 * Unlike Python, JS scripts aren't run linearly. Thus it is possible to
 * refer to a function name in a script before the function is actually
 * defined in the script. This does not mean, however, that the function
 * will be *called* before it is defined.
 *
 * If a function is passed with parentheses at the end (e.g. doSomething()),
 * that would call the function immediately and pass the result to the
 * flowScheduler.add() method. Without the parentheses, the uncalled function is
 * itself being passed to the flowScheduler.add() method.
 *
 * However, in an effort to make the code linearly-readable, where possible,
 * functions will be added to Schedulers immediately following their definitions.
 */

/**
 * Update the session info object.
 *
 * This takes the information from the dialog box presented to the participant
 * and adds it to the object recording the session information.
 *
 * @returns     {Scheduler.Event.NEXT}  Return the NEXT code
 */
function updateInfo () {
  exp.sessionData['session.date'] = util.MonotonicClock.getDateStr()
  exp.sessionData['session.exp_name'] = expName
  exp.sessionData['session.psychojs_version'] = psychoJSVersion

  /**
   * Collecting browser and operating system information is important to be able
   * to check for any systematic skew in how an experiment runs. This is critical
   * for experiments where small differences in timing can affect the results.
   */
  exp.sessionData['session.browser'] = util.detectBrowser()
  exp.sessionData['session.os'] = window.navigator.platform

  /**
   * This will attempt to measure the actual frame rate of the experiment.
   * However, PsychoJS will always return 60 FPS for this value in
   * version 2020.1: https://github.com/psychopy/psychojs/blob/1fc76d14618acd267d58677dd9e725d6b21f1a74/js/core/Window.js#L155
   *
   * This line is being implemented now to handle when core.Window.getActualFrameRate
   * is actually functional.
   */
  exp.sessionData['session.nominal_frame_rate'] = psychoJS.window.getActualFrameRate()

  /**
   * Add URL parameters to `sessionData`.
   *
   * Parameters can be passed via the URL and automatically stored in the
   * data file this way: https://pavlovia.org/docs/experiments/url-parameters
   */
  util.addInfoFromUrl(sessionInfo)

  // psychoJS.experiment.addData('participant', sessionInfo.participant)
  // psychoJS.experiment.addData('session', sessionInfo.session)
  // psychoJS.experiment.addData('score', 0)
  // psychoJS.experiment.addData('totalScore', 0)
  // psychoJS.experiment.addData('keySeq', '')
  // psychoJS.experiment.addData('respStream', [])

  exp.addSessionDataObject({
    participant: sessionInfo.participant,
    session: sessionInfo.session,
    // score: 0,
    // totalScore: 0,
    // keySeq: '',
    // key: -1,
    // keyTimestamp: null,
    // rt: null,
    // tStart: null,
    // frameNStart: null,
    // avgFrameRate: null,
  })
  // psychoJS.experiment.nextEntry()

  return Scheduler.Event.NEXT
}

flowScheduler.add(updateInfo)

/**
 * Initializes the experiment and keyboard handler.
 *
 * @returns     {Scheduler.Event.NEXT}  Return the NEXT code
 */

flowScheduler.add(exp.init)

/**
 * Initializes the timer variable declared in the experimentUtils.js file.
 *
 * @returns     {Scheduler.Event.NEXT}  Return the NEXT code
 */

flowScheduler.add(exp.initializeTimers)

/**
 * Create a Scheduler to handle the instructions steps.
 *
 * @type       {Scheduler}
 */

if (runParts.indexOf('instructions') > -1) {
  const instrLoopScheduler = new Scheduler(psychoJS)
  flowScheduler.add(instr.init, mainInstructions.generateInstructions)
  flowScheduler.add(instr.loopBegin, instrLoopScheduler)
  flowScheduler.add(instrLoopScheduler)
}

if (runParts.indexOf('audioTest') > -1) {
  const audioTestScheduler = new Scheduler(psychoJS)
  flowScheduler.add(audioTest.init)
  flowScheduler.add(audioTest.loopBegin, audioTestScheduler)
  flowScheduler.add(audioTestScheduler)
}

/**
 * Create a scheduler to hold the trial steps.
 *
 * This series of functions initializes the object trials, creates each step of
 * the trial loop, and runs it.
 *
 * The `trials` object is imported from `src/trials.js`.
 *
 * TODO: A previous attempt to put all of this inside of the `trials.init` function
 * and call it as `trials.init()` is called above failed because of a stack overflow error.
 * A big improvment in code organization can be made by determining the cause of
 * that issue.
 *
 * @type       {Scheduler}
 */
const trialLoopScheduler = new Scheduler(psychoJS)
// flowScheduler.add(viz.prepareVisuals)
flowScheduler.add(audioStims.prepareStimuli)

flowScheduler.add(blocks.loadStimData)

if (runParts.indexOf('task') > -1) {
  flowScheduler.add(trials.trialLoopBegin, trialLoopScheduler)
  flowScheduler.add(trialLoopScheduler)
  flowScheduler.add(trials.trialLoopEnd)
}

if (runParts.indexOf('comprehension') > -1) {
  const compInstrScheduler = new Scheduler(psychoJS)
  flowScheduler.add(instr.init, comprehensionInstructions.generateInstructions)
  flowScheduler.add(instr.loopBegin, compInstrScheduler)
  flowScheduler.add(compInstrScheduler)

  const comprehensionLoopScheduler = new Scheduler(psychoJS)
  flowScheduler.add(comprehension.loadTrials)
  // flowScheduler.add(console.log, 'Testing the flow scheduler...')
  flowScheduler.add(comprehension.comprehensionLoopBegin, comprehensionLoopScheduler)
  flowScheduler.add(comprehensionLoopScheduler)
  flowScheduler.add(comprehension.comprehensionLoopEnd)
}

if (runParts.indexOf('demographics') > -1) {
  const demographicInstrScheduler = new Scheduler(psychoJS)
  flowScheduler.add(instr.init, demographicInstructions.generateInstructions)
  flowScheduler.add(instr.loopBegin, demographicInstrScheduler)
  flowScheduler.add(demographicInstrScheduler)

  const demographicsLoopScheduler = new Scheduler(psychoJS)
  flowScheduler.add(demographics.loadQuestions)
  flowScheduler.add(demographics.prepareQuestionnaireVisuals)
  flowScheduler.add(demographics.demographicLoopBegin, demographicsLoopScheduler)
  flowScheduler.add(demographicsLoopScheduler)
  flowScheduler.add(demographics.demographicLoopEnd)
}

/**
 * Terminate the experiment loop.
 *
 * @param      {string}   message      Optional message to display when quitting
 * @param      {boolean}  isCompleted  Indicates if the participant has completed the experiment
 * @returns    {Scheduler.Event.QUIT}   Return the QUIT code
 */
export function quitPsychoJS (message, isCompleted) {
  // Save any orphaned data before quitting
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry()
  }

  // psychoJS.experiment.save({
  //   attributes: [
  //     'score',
  //     'totalScore',
  //     'session',
  //     'participant',
  //   ]
  // })

  if (!isCompleted) {
    psychoJS.experiment.save()
  }
  psychoJS.window.close()
  psychoJS.quit({
    message: message,
    isCompleted: isCompleted
  })

  return Scheduler.Event.QUIT
}
flowScheduler.add(quitPsychoJS, '', true)

/**
 * Add task to be called if participant doesn't press OK.
 *
 * The method signature `add(task, ...args)` means that the first argument
 * is the function that will be called and any following arguments will be
 * passed to the function when it is called.
 */
dialogCancelScheduler.add(quitPsychoJS, '', false)

/**
 * Begin the experiment.
 *
 * The variable `psychoJS` is a scheduler, and the `.start()` method
 * causes the scheduler to start running. This begins the asynchronous
 * chain of events that make the experiment run.
 */
psychoJS.start({
  expName: expName,
  expInfo: sessionInfo,
  resources: resourcesList,
})
