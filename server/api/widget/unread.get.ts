import { countWidgetBadge } from '#layers/loopdesk/server/utils/widget-unread'

// Badge count for the launcher. requireAuthInOrg, not requireOrgMember: the
// caller is an end user of the customer's product, never a Loopdesk staff member.
export default defineEventHandler(async (event): Promise<{ count: number, feedback: number }> => {
  const { session, orgId } = await requireAuthInOrg(event)
  return countWidgetBadge(orgId, session.user.id)
})
