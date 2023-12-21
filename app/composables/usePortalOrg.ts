import type { ResolvedBranding } from '#layers/loopdesk/shared/utils/branding'
import { resolveBranding } from '#layers/loopdesk/shared/utils/branding'
import type { ResolvedGuestAccess } from '#layers/loopdesk/shared/utils/guest'
import { resolveGuestAccess } from '#layers/loopdesk/shared/utils/guest'
import type { ResolvedPortalModules } from '#layers/loopdesk/shared/utils/portal-modules'
import { resolvePortalModules } from '#layers/loopdesk/shared/utils/portal-modules'

export interface PortalOrg {
  name: string // org name, or 'Loopdesk' for the default org
  logo: string | null
  isDefault: boolean // unconfigured default org → generic share-card copy
  branding: ResolvedBranding
  guest: ResolvedGuestAccess
  modules: ResolvedPortalModules
}

// Portal identity for share-card meta. Populated per-request by
// plugins/portal-org.server.ts and hydrated via payload; generic default until then.
export function usePortalOrg() {
  return useState<PortalOrg>('portal-org', () => ({
    name: 'Loopdesk',
    logo: null,
    isDefault: true,
    branding: resolveBranding(null),
    guest: resolveGuestAccess(null),
    modules: resolvePortalModules(null),
  }))
}
