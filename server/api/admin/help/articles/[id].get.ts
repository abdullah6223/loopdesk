import { articleRecord } from '#layers/loopdesk/server/services/help-center'

export default defineEventHandler(async event => {
  const { orgId } = await requireOrgMember(event)
  const article = await articleRecord({ db: useDB(), orgId }, getRouterParam(event, 'id')!)
  const { id, shortId, slug, title, description, content, status, aiEnabled, publishedAt, createdAt, updatedAt, collection, indexError, indexStatus } = article
  return { id, shortId, slug, title, description, content, status, aiEnabled, publishedAt, createdAt, updatedAt, collection, indexError, indexStatus }
})
