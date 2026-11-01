// Feature flags. NEXT_PUBLIC_ so client components can read them; the value is
// inlined at build time, so changing it on Vercel requires a redeploy.

// FoodAi launches as a comparison/redirect service only. Direct ordering
// (restaurant pages, cart, checkout, /orders) stays in the codebase but is
// unreachable until this is explicitly set to "true".
export const DIRECT_ORDERING_ENABLED = process.env.NEXT_PUBLIC_DIRECT_ORDERING_ENABLED === 'true'
