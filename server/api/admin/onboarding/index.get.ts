import { eq } from 'drizzle-orm'
import { organization } from '#layers/loopdesk/server/db/schemas'
import { parseOrgMetadata } from '#layers/loopdesk/shared/utils/branding'

// GET /api/admin/onboarding — whether the dashboard should open the onboarding
// guide by itself for the current user. Only the user who created the workspace
// (organization.metadata.onboarding.autoOpenFor) gets it, once.
export default defineEventHandler(async (event): Promise<{ autoOpen: boolean }> => {
  const { session, orgId } = await requireOrgPermission(event, { loopdesk: ['moderate'] })
  const [org] = await useDB()
    .select({ metadata: organization.metadata })
    .from(organization)
    .where(eq(organization.id, orgId))
    .limit(1)
  const onboarding = parseOrgMetadata(org?.metadata ?? null).onboarding as { autoOpenFor?: unknown } | undefined
  return { autoOpen: onboarding?.autoOpenFor === session.user.id }
})
