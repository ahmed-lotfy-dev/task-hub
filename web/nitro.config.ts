export default {
  routeRules: {
    "/api/**": {
      proxy: (process.env.VITE_API_URL || "http://api:8000") + "/**",
    },
  },
  compatibilityDate: "2024-04-03",
}
