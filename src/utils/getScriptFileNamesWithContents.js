import fs from 'fs'

export async function getScriptFileNamesWithContents() {
  const scripts = []

  try {
    const files = await fs.promises.readdir('scripts')

    for (const file of files) {
      const content = await fs.promises.readFile(`scripts/${file}`, 'utf-8')

      scripts.push({ name: file, content })
    }
  } catch (err) {
    console.error(err)
  }

  return scripts
}
