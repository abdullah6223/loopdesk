import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { createArticle } from '#layers/loopdesk/server/services/help-center'
import { createHelpArticleSchema } from '#layers/loopdesk/shared/schemas/help'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, createHelpArticleSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => createArticle(context, body))
  setResponseStatus(event, 201)
  return result
})
