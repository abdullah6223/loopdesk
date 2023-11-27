import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { createBoard } from '#layers/loopdesk/server/services/boards'
import { createBoardSchema } from '#layers/loopdesk/shared/schemas/board'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, createBoardSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => createBoard(context, body))
  setResponseStatus(event, 201)
  return result
})
