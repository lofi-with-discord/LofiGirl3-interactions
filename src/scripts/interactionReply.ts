import _ from '../consts'

import {
  CommandInteraction,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  MessageSelectMenu,
  WebhookEditMessageOptions
} from 'discord.js'

type AcceptableInteractions = CommandInteraction | MessageComponentInteraction
type AcceptableComponents = string | MessageEmbed | MessageSelectMenu | MessageButton

export function replyInteraction (interaction: AcceptableInteractions, ...components: AcceptableComponents[]) {
  const payload = {} as WebhookEditMessageOptions

  for (const component of components) {
    if (component instanceof MessageEmbed) {
      if (!payload.embeds) payload.embeds = []
      payload.embeds.push(component)
    }

    if (typeof component === 'string') {
      if (!payload.content) payload.content = ''
      payload.content += component
    }

    if (component instanceof MessageSelectMenu || component instanceof MessageButton) {
      if (!payload.components) payload.components = _.COMPONENT_ARRAY()
      payload.components[0].components.push(component)
    }
  }

  return interaction.editReply(payload).catch(() => {})
}
