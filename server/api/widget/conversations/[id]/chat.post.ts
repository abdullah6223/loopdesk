import { widgetActor, withAgentRuntime } from '#layers/loopdesk/server/lib/agent/runtime'
import { streamAgentReply } from '#layers/loopdesk/server/lib/agent/chat'

export default defineEventHandler(event => withAgentRuntime(event, async () => {
  return streamAgentReply(event, await widgetActor(event))
}))
