import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import typescript2 from 'rollup-plugin-typescript2';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          outDir: 'dist',
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      exclude: ['vite.config.ts'],
    }),
    // federation({
    //   name: 'mfe-components', // Change with frontend service name
    //   filename: 'index.js',
    //   exposes: {
    //     // Change this with component want to expose
    //     './App': './src/App.vue',
    //     './DynamicDialog': './src/components/DynamicDialog.vue',
    //     './DynamicTable': './src/components/DynamicTable.vue',
    //     './GroupNameContainer': './src/components/GroupNameContainer.vue',
    //     './MultiInputText': './src/components/MultiInputText.vue',
    //     './NameContainer': './src/components/NameContainer.vue',
    //     './SearchButton': './src/components/SearchButton.vue',
    //     './VCalendar': './src/components/VCalendar.vue',
    //     './VCheckbox': './src/components/VCheckbox.vue',
    //     './VDropdown': './src/components/VDropdown.vue',
    //     './VInput': './src/components/VInput.vue',
    //     './VMultiSelect': './src/components/VMultiSelect.vue',
    //     './VRadioButtons': './src/components/VRadioButtons.vue',
    //   },
    //   shared: ['vue', 'axios', 'vue-router', 'vuex'],
    // }),
  ],
  build: {
    // target: 'esnext',
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/components/main.ts',
      name: 'tsMfeConsoleVueComponents',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `ts-mfe-console-vue-components.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: path.resolve(__dirname, 'src/components/main.ts'),
      },
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'main.css') return 'style.css';
          return assetInfo.name;
        },
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  preview: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~primevue': path.resolve(__dirname, 'node_modules/primevue'),
      '~rfs': path.resolve(__dirname, 'node_modules/rfs'),
    },
  },
});
