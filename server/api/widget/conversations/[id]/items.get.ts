import { widgetActor, withAgentRuntime } from '#layers/loopdesk/server/lib/agent/runtime'
import { readConversationItems } from '#layers/loopdesk/server/lib/agent/history'

export default defineEventHandler(event => withAgentRuntime(event, async () => {
  return readConversationItems(event, await widgetActor(event))
}))
