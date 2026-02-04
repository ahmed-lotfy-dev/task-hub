export default {
  routeRules: {
    "/api/**": {
      proxy: process.env.VITE_API_URL + "/**",
    },
  },
  compatibilityDate: "2025-01-30",
}
