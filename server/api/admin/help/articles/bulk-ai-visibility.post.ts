import { and, eq, inArray, ne } from 'drizzle-orm'
import { helpArticle } from '#layers/loopdesk/server/db/schemas'
import { bulkHelpAiVisibilitySchema } from '#layers/loopdesk/shared/schemas/help'

export default defineEventHandler(async event => {
  const { orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const body = await readValidatedBody(event, bulkHelpAiVisibilitySchema.parse)
  const ids = [...new Set(body.ids)]
  const changed = await useDB().update(helpArticle).set({ aiEnabled: body.aiEnabled })
    .where(and(eq(helpArticle.orgId, orgId), inArray(helpArticle.id, ids), ne(helpArticle.aiEnabled, body.aiEnabled)))
    .returning({ id: helpArticle.id })
  return { affected: changed.length, skipped: ids.length - changed.length }
})
