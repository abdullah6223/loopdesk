import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { createChangelog } from '#layers/loopdesk/server/services/changelogs'
import { createChangelogSchema } from '#layers/loopdesk/shared/schemas/changelog'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, createChangelogSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => createChangelog(context, body))
  setResponseStatus(event, 201)
  return result
})
