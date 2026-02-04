export default {
  routeRules: {
    "/api/**": {
      proxy: (process.env.VITE_API_URL || "http://api:8000") + "/api/**",
    },
  },
  compatibilityDate: "2025-01-30",
}
