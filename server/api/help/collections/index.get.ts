import { listPublicCollections } from '#layers/loopdesk/server/services/help-center-queries'

export default defineEventHandler(async (event) => {
  const orgId = await requireHelpCenterOrg(event)

  return listPublicCollections({ db: useDB(), orgId })
})
