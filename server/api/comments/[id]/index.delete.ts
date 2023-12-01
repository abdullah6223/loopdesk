import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { deleteComment } from '#layers/loopdesk/server/services/comments'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireAuthInOrg(event)
  await contentTransaction(event, orgId, session.user.id, context => deleteComment(context, getRouterParam(event, 'id')!))
  setResponseStatus(event, 204)
  return null
})
