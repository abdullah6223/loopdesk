import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { updateArticle } from '#layers/loopdesk/server/services/help-center'
import { updateHelpArticleSchema } from '#layers/loopdesk/shared/schemas/help'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, updateHelpArticleSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => updateArticle(context, getRouterParam(event, 'id')!, body))
  return result
})
