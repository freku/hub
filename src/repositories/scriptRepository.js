import { SCRIPT_STATUS } from '../consts/SCRIPT_STATUS.js'
import { Script } from '../models/script.js'

export const updateScriptToRunningState = async (scriptName, userId, pid) => {
  return await Script.findOneAndUpdate(
    { name: scriptName },
    {
      status: SCRIPT_STATUS.RUNNING,
      runBy: userId,
      pid,
    },
    { new: true }
  )
    .populate('runBy', '-password')
    .exec()
}

export const updateScriptToIdleState = async (scriptName) => {
  return await Script.findOneAndUpdate(
    { name: scriptName },
    {
      status: SCRIPT_STATUS.IDLE,
      pid: null,
    },
    { new: true }
  )
    .populate('runBy', '-password')
    .exec()
}

export const getScriptByName = async (scriptName) => {
  return await Script.findOne({ name: scriptName }).populate('runBy').exec()
}
