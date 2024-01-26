import { listManagementCollections } from '#layers/loopdesk/server/services/help-center-queries'

export default defineEventHandler(async (event) => {
  const { orgId } = await requireOrgMember(event)

  const query = getQuery(event)

  return listManagementCollections({ db: useDB(), orgId }, query.flat === '1')
})
