/**
 * Functions and variables used globally in the experiment.
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

import { PsychoJS } from '../lib/core-2020.1.js'
import * as core from '../lib/core-2020.1.js'
import * as util from '../lib/util-2020.1.js'
import { Scheduler } from '../lib/util-2020.1.js'

import { psychoJS } from '../index.js'

/**
 * Create a clock to track the time elapsed since the beginning of the experiment.
 *
 * @type       {util.Clock}
 */
export var globalClock

/**
 * Create a timer to track the remaining time in a routine.
 *
 * @type       {util.CountdownTimer}
 */
export var routineTimer

export var restTimer

export function initializeTimers () {
  globalClock = new util.Clock()
  routineTimer = new util.CountdownTimer()
  restTimer = new util.CountdownTimer()

  return Scheduler.Event.NEXT
}

export var scoreList = []

export var sessionData = {}

export function addSessionDataObject (dataObject) {
  for (const [key, value] of Object.entries(dataObject)) {
    psychoJS.experiment.addData(key, value)
  }
}

export var colors = {
  black: new util.Color('#000000'),
  gray: new util.Color('#a9a9a9'),
}

export function setBackgroundColor (bgColor) {
  psychoJS.window.color = bgColor
  psychoJS.window._fullRefresh()
}

export function importConditions (loop) {
  const trialIndex = loop.getTrialIndex()

  return function () {
    loop.setTrialIndex(trialIndex)
    psychoJS.importAttributes(loop.getCurrentTrial())

    return Scheduler.Event.NEXT
  }
}

export var keyboardHandler
export function init () {
  keyboardHandler = new core.Keyboard({
    psychoJS, // Attach it to our psychoJS instance.
    clock: new util.Clock(), // Attach a new resettable monotonic clock to the handler.
    waitForStart: true, // Only start the clock when the start() method is called.
  })

  return Scheduler.Event.NEXT
}
