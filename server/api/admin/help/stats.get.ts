import { getHelpStats } from '#layers/loopdesk/server/services/help-center-queries'

export default defineEventHandler(async (event) => {
  const { orgId } = await requireOrgMember(event)

  return getHelpStats({ db: useDB(), orgId })
})
