import { Scheduler } from '../lib/util-2021.1.0.js'
import * as util from '../lib/util-2021.1.0.js'
import * as visual from '../lib/visual-2021.1.0.js'

import { psychoJS } from '../index.js'
import * as exp from './experimentUtils.js'

/**
 * Creates a TextStim object from stim-specific properties.
 *
 * This function takes an object containing parameters that should be specific
 * to the created `visual.TextStim` object, combines them with the values in
 * `commonTextStimProperties` (overwriting the common values with the passed values,
 * if necessary), and returns the new `visual.TextStim` object using these values.
 *
 * @param      {object}  commonTextStimProperties  The default properties for the TextStim
 * @param      {object}  textStimProperties  The properties specific to this TextStim
 * @returns    {visual.TextStim}  A new TextStim object
 *
 */
function createTextStim (commonTextStimProperties, textStimProperties) {
  const commonProps = Object.create(commonTextStimProperties)
  const stimulusProps = Object.assign(commonProps, textStimProperties)

  return new visual.TextStim(stimulusProps)
}

/**
 * @type {(object|visual.TextStim)}
 */
const stimDefinitions = {
  header: {
    name: 'visuals/header',
    height: 0.1,
    pos: [0, 0.8],
    alignVert: 'top',
    bold: true,
  },
  centeredText: {
    name: 'visuals/centeredText',
    height: 0.1,
    pos: [0, 0],
  },
  bodyText: {
    name: 'visuals/bodyText',
    height: 0.1,
    pos: [0, 0.6],
    alignVert: 'top',
    alignHoriz: 'left',
  },
  centeredBodyText: {
    name: 'visuals/centeredBodyText',
    height: 0.1,
    pos: [0, 0.6],
    alignVert: 'top',
    alignHoriz: 'center',
  },
  continuationText: {
    name: 'visuals/continuationText',
    height: 0.075,
    pos: [0, -0.9],
  },
  targetWordText: {
    name: 'visuals/targetWordText',
    height: 0.33,
    pos: [0, 0],
  },
  restText: {
    name: 'visuals/restText',
    height: 0.33,
    pos: [0, 0],
    text: 'REST',
    color: new util.Color('#3271a8'),
  },
  group1Text: {
    name: 'visuals/group1Text',
    height: 0.1,
    pos: [-0.33, 0],
    wrapWidth: 0.5,
    text: 'Press the left arrow to choose Group 1\n\n←',
  },
  group2Text: {
    name: 'visuals/group2Text',
    height: 0.1,
    pos: [0.33, 0],
    wrapWidth: 0.5,
    text: 'Press the left arrow to choose Group 2\n\n→',
  }
}

export function prepareVisuals () {
  const commonTextStimProperties = {
    win: psychoJS.window,
    font: 'Arial',
    units: 'norm',
    text: '',
    wrapWidth: 1.7,
    ori: 0,
    color: new util.Color('black'),
    opacity: 1,
    depth: 0.0,
    alignHoriz: 'center',
    alignVert: 'center',
    autoDraw: false,
    autoLog: true,
  }

  const visualsObject = new Map()

  for (const stimName of Object.keys(stimDefinitions)) {
    visualsObject[stimName] = createTextStim(
      commonTextStimProperties,
      stimDefinitions[stimName]
    )
  }

  return visualsObject
  // return Scheduler.Event.NEXT
}
