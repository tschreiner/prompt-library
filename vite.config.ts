import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { defineConfig } from 'vitest/config';
import { renderPrompts } from './scripts/render-prompts';

function promptTemplatesPlugin(): Plugin {
  const promptsGlob = path.resolve(process.cwd(), 'prompts/**/*.{yaml,yml}');

  return {
    name: 'prompt-templates',
    async buildStart() {
      await renderPrompts();
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add(promptsGlob);

      const render = async (filePath: string) => {
        if (!/\.ya?ml$/i.test(filePath)) return;

        try {
          await renderPrompts();
          server.config.logger.info(
            `prompt templates rendered from ${path.relative(process.cwd(), 'prompts')}`,
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          server.config.logger.error(message);
        }
      };

      server.watcher.on('add', render);
      server.watcher.on('change', render);
      server.watcher.on('unlink', render);
    },
  };
}

export default defineConfig({
  plugins: [promptTemplatesPlugin(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
