const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const rest = new REST({ version: '9' }).setToken(process.argv[2])

; (async () => {
  try {
    if (!process.argv[4]) {
      const data = await rest.get(Routes.applicationCommands(process.argv[3]))
      console.log(data.reduce((acc, cmd) => acc + `${cmd.name} - ${cmd.id}\n`, ''))
      return
    }

    await rest.delete(Routes.applicationCommand(process.argv[3], process.argv[4]))
  } catch (error) {
    console.error(error)
  }
})()
