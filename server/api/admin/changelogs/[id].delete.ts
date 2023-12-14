import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { deleteChangelog } from '#layers/loopdesk/server/services/changelogs'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  await contentTransaction(event, orgId, session.user.id, context => deleteChangelog(context, getRouterParam(event, 'id')!))
  setResponseStatus(event, 204)
  return null
})
