import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { publishChangelog } from '#layers/loopdesk/server/services/changelogs'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const result = await contentTransaction(event, orgId, session.user.id, context => publishChangelog(context, getRouterParam(event, 'id')!))
  return result
})
