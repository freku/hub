import findProcess from 'find-process'

export const isMyProcess = async (pid) => {
  try {
    const processList = await findProcess('pid', pid)

    if (processList.length === 0) {
      return false
    }

    const processDetails = processList[0]
    const parentProcessId = processDetails.ppid
    const currentProcessId = process.pid

    return parentProcessId === currentProcessId
  } catch (error) {
    console.error(`Error: ${error.message}`)
    return false
  }
}
