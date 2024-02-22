// vite.config.ts
import { defineConfig } from "file:///C:/Users/kurni/Desktop/ADMIN-CONSOLE/ts-admin-components/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/kurni/Desktop/ADMIN-CONSOLE/ts-admin-components/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import dts from "file:///C:/Users/kurni/Desktop/ADMIN-CONSOLE/ts-admin-components/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\kurni\\Desktop\\ADMIN-CONSOLE\\ts-admin-components";
var vite_config_default = defineConfig({
  base: "/ts-admin-components-dev",
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    // target: 'esnext',
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "src/components/main.ts",
      name: "tsAdminComponentsDev",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `ts-admin-components-dev.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: path.resolve(__vite_injected_original_dirname, "src/components/main.ts")
      },
      external: ["vue"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "main.css")
            return "style.css";
          return assetInfo.name;
        },
        exports: "named",
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  preview: {
    port: 8080
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "scss": path.resolve(__vite_injected_original_dirname, "src/assets/scss"),
      "~bootstrap": path.resolve(__vite_injected_original_dirname, "node_modules/bootstrap"),
      "~primevue": path.resolve(__vite_injected_original_dirname, "node_modules/primevue"),
      "~remixicon": path.resolve(__vite_injected_original_dirname, "node_modules/remixicon"),
      "~rfs": path.resolve(__vite_injected_original_dirname, "node_modules/rfs")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrdXJuaVxcXFxEZXNrdG9wXFxcXEFETUlOLUNPTlNPTEVcXFxcdHMtYWRtaW4tY29tcG9uZW50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca3VybmlcXFxcRGVza3RvcFxcXFxBRE1JTi1DT05TT0xFXFxcXHRzLWFkbWluLWNvbXBvbmVudHNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2t1cm5pL0Rlc2t0b3AvQURNSU4tQ09OU09MRS90cy1hZG1pbi1jb21wb25lbnRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcvdHMtYWRtaW4tY29tcG9uZW50cy1kZXYnLFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgbGliOiB7XG4gICAgICAvLyBDb3VsZCBhbHNvIGJlIGEgZGljdGlvbmFyeSBvciBhcnJheSBvZiBtdWx0aXBsZSBlbnRyeSBwb2ludHNcbiAgICAgIGVudHJ5OiAnc3JjL2NvbXBvbmVudHMvbWFpbi50cycsXG4gICAgICBuYW1lOiAndHNBZG1pbkNvbXBvbmVudHNEZXYnLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnLCAndW1kJ10sXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYHRzLWFkbWluLWNvbXBvbmVudHMtZGV2LiR7Zm9ybWF0fS5qc2AsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAvLyBtYWtlIHN1cmUgdG8gZXh0ZXJuYWxpemUgZGVwcyB0aGF0IHNob3VsZCBub3QgYmUgYnVuZGxlZFxuICAgICAgLy8gaW50byB5b3VyIGxpYnJhcnlcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cy9tYWluLnRzJyksXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgPT09ICdtYWluLmNzcycpIHJldHVybiAnc3R5bGUuY3NzJztcbiAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cG9ydHM6ICduYW1lZCcsXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICB2dWU6ICdWdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgICdzY3NzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9hc3NldHMvc2NzcycpLFxuICAgICAgJ35ib290c3RyYXAnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcCcpLFxuICAgICAgJ35wcmltZXZ1ZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcHJpbWV2dWUnKSxcbiAgICAgICd+cmVtaXhpY29uJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9yZW1peGljb24nKSxcbiAgICAgICd+cmZzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9yZnMnKSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsb0JBQW9CO0FBQ25ZLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBSGhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQTtBQUFBLE1BRUgsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sT0FBTyxLQUFLO0FBQUEsTUFDNUIsVUFBVSxDQUFDLFdBQVcsMkJBQTJCO0FBQUEsSUFDbkQ7QUFBQSxJQUNBLGVBQWU7QUFBQTtBQUFBO0FBQUEsTUFHYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyx3QkFBd0I7QUFBQSxNQUN4RDtBQUFBLE1BQ0EsVUFBVSxDQUFDLEtBQUs7QUFBQSxNQUNoQixRQUFRO0FBQUEsUUFDTixnQkFBZ0IsQ0FBQyxjQUFjO0FBQzdCLGNBQUksVUFBVSxTQUFTO0FBQVksbUJBQU87QUFDMUMsaUJBQU8sVUFBVTtBQUFBLFFBQ25CO0FBQUEsUUFDQSxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUNsQyxRQUFRLEtBQUssUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUNqRCxjQUFjLEtBQUssUUFBUSxrQ0FBVyx3QkFBd0I7QUFBQSxNQUM5RCxhQUFhLEtBQUssUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxNQUM1RCxjQUFjLEtBQUssUUFBUSxrQ0FBVyx3QkFBd0I7QUFBQSxNQUM5RCxRQUFRLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxJQUNwRDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
