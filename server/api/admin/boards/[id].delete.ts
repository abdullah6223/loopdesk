import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { deleteBoard } from '#layers/loopdesk/server/services/boards'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  await contentTransaction(event, orgId, session.user.id, context => deleteBoard(context, getRouterParam(event, 'id')!))
  setResponseStatus(event, 204)
  return null
})
