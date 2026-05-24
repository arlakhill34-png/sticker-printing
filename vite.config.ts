// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";
// import tailwindcss from "@tailwindcss/vite";
// import { tanstackRouter } from "@tanstack/router-plugin/vite";

// export default defineConfig({
//   plugins: [
//     tsconfigPaths(),
//     tanstackRouter({
//       target: "react",
//       autoCodeSplitting: true,
//       // Disable runtime route generation in the browser build graph.
//       // The plugin still consumes your existing generated `routeTree.gen.ts`.
//       enableRouteGeneration: false,
//     }),

//     react(),
//     tailwindcss(),
//   ],

//   build: {
//     chunkSizeWarningLimit: 750,
//     // rollupOptions: {
//     //   // Prevent server-only/router-generator tooling (fs/path/url/chokidar...) from being treated
//     //   // as browser-compatible dependencies during the client bundle build.
//     //   external: [
//     //     "@tanstack/router-generator",
//     //     "@tanstack/router-utils",
//     //     "chokidar",
//     //     "readdirp",
//     //     "jiti",
//     //     "glob",
//     //     "glob-parent",
//     //     "tinyglobby",
//     //     "fdir",
//     //     "fsevents",
//     //   ],
//       output: {
//         manualChunks: {
//           // Keep a stable split for frequently used admin-related code.
//           // This prevents the root chunk from becoming a single massive bundle.
//           admin: ["src/routes/admin", "src/components/ui/sidebar", "lucide-react", "recharts"],
//           // Vendor-ish libs (React ecosystem) frequently appear together.
//           react_vendor: [
//             // Note: keep router packages here; generator tooling is excluded above via rollupOptions.external.

//             "react",
//             "react-dom",
//             "@tanstack/react-router",
//             "@tanstack/react-query",
//             "@tanstack/router-plugin",
//             "@tanstack/router-core",
//             "@tanstack/store",
//           ],
//         },
//       },
//     },
//   // },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      enableRouteGeneration: false,
    }),
    react(),
    tailwindcss(),
  ],

  build: {
    chunkSizeWarningLimit: 750,

    rollupOptions: {
      output: {
        manualChunks: {
          admin: ["src/routes/admin", "src/components/ui/sidebar", "lucide-react", "recharts"],

          react_vendor: [
            "react",
            "react-dom",
            "@tanstack/react-router",
            "@tanstack/react-query",
            "@tanstack/router-plugin",
            "@tanstack/router-core",
            "@tanstack/store",
          ],
        },
      },
    },
  },
});
