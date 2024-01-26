import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { deleteArticle } from '#layers/loopdesk/server/services/help-center'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  await contentTransaction(event, orgId, session.user.id, context => deleteArticle(context, getRouterParam(event, 'id')!))
  setResponseStatus(event, 204)
  return null
})
