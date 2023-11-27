import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { updateBoard } from '#layers/loopdesk/server/services/boards'
import { updateBoardSchema } from '#layers/loopdesk/shared/schemas/board'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, updateBoardSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => updateBoard(context, getRouterParam(event, 'id')!, body))
  return result
})
