import { getPublicCollection } from '#layers/loopdesk/server/services/help-center-queries'

export default defineEventHandler(async (event) => {
  const orgId = await requireHelpCenterOrg(event)
  const id = getRouterParam(event, 'id')!

  return getPublicCollection({ db: useDB(), orgId }, id)
})
