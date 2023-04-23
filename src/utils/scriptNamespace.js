export const getRoomNameForScript = (scriptName) => `script:${scriptName}`

export const getNamespaces = (scriptName) => {
  const baseNamespace = getRoomNameForScript(scriptName)
  const statusNamespace = `${baseNamespace}:status`
  const outputNamespace = `${baseNamespace}:output`

  return { baseNamespace, statusNamespace, outputNamespace }
}
