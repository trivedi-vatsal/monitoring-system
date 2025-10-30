export const siteConfig = {
  name: "Service Monitoring",
  url: "http://localhost:3000",
  description: "Monitor and track the health of your services in real-time.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    services: "/services",
    details: "/details",
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
    },
  },
}

export type siteConfig = typeof siteConfig
