import { contentTransaction } from '#layers/loopdesk/server/services/content-context'
import { updateCollection } from '#layers/loopdesk/server/services/help-center'
import { updateHelpCollectionSchema } from '#layers/loopdesk/shared/schemas/help'

export default defineEventHandler(async event => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, updateHelpCollectionSchema.parse)
  const result = await contentTransaction(event, orgId, session.user.id, context => updateCollection(context, getRouterParam(event, 'id')!, body))
  return result
})
