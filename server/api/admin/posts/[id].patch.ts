import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { updateFeedback } from '#layers/loopdesk/server/services/feedback'
import { updatePostSchema } from '#layers/loopdesk/shared/schemas/post'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, updatePostSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => updateFeedback(context, getRouterParam(event, 'id')!, body))
  return result
})
