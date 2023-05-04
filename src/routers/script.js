import { Router } from 'express'
import { Script } from '../models/script.js'
import { getNamespaces } from '../utils/scriptNamespace.js'
import pty from 'node-pty'
import {
  updateScriptToRunningState,
  updateScriptToIdleState,
  getScriptByName,
} from '../repositories/scriptRepository.js'
import { io, redisClient } from '../globals/index.js'
import { isMyProcess } from '../utils/isMyProcess.js'
import { SCRIPT_STATUS } from '../consts/SCRIPT_STATUS.js'
import { StatusCodes } from 'http-status-codes'

const router = Router()

export default function scriptRouter() {
  router.get('/scripts', async (req, res) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000))

    return res.send(await Script.find({}).populate('runBy').exec())
  })

  router.get('/script/:scriptName', async (req, res) => {
    const scriptName = req.params.scriptName

    return res.send(
      await Script.findOne({ name: scriptName }).populate('runBy').exec()
    )
  })

  router.post('/cancel-script', async (req, res) => {
    const { scriptName } = req.body

    const script = await getScriptByName(scriptName)

    if (script && script.status === SCRIPT_STATUS.RUNNING) {
      if (await isMyProcess(script.pid)) {
        process.kill(script.pid)

        return res.send({ message: 'Script cancelled' })
      }
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Script not running' })
  })

  router.post('/run-script', async (req, res) => {
    // TODO: check if script is already running and if it is, return Bad Request 400
    const { scriptName } = req.body
    const { outputNamespace } = getNamespaces(scriptName)

    const script = pty.spawn('sh', [`/app/scripts/${scriptName}`], {
      name: 'xterm-color',
      rows: 25,
      cols: 80,
      cwd: process.cwd(),
      env: process.env,
    })

    script.onData(async (data) => {
      await redisClient.append(outputNamespace, data)

      io.to(outputNamespace).emit('script:output', data)
    })

    script.onExit(async () => {
      console.log(
        `script ${scriptName} finished at ` + new Date().toLocaleTimeString()
      )
      const src = await updateScriptToIdleState(scriptName)
      io.to(outputNamespace).emit('script:status', src)
    })

    const scr = await updateScriptToRunningState(
      scriptName,
      req.auth.id,
      script.pid
    )
    io.to(outputNamespace).emit('script:status', scr)

    console.log(
      `script ${scriptName} started at ` + new Date().toLocaleTimeString()
    )

    await redisClient.del(outputNamespace)

    return res.send({ message: 'Script started' })
  })

  return router
}
