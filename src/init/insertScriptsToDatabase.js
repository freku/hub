import { getScriptFileNamesWithContents } from '../utils/getScriptFileNamesWithContents.js'
import { Script } from '../models/script.js'
import { SCRIPT_STATUS } from '../consts/SCRIPT_STATUS.js'

export const insertScriptsInDatabase = async () => {
  const scripts = await getScriptFileNamesWithContents()

  await Script.deleteMany({})

  await Script.insertMany(
    scripts.map((script) => ({
      name: script.name,
      status: SCRIPT_STATUS.IDLE,
      content: script.content,
    }))
  )
}
