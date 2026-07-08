import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PromptRenderError, renderPrompts } from './render-prompts';

let tempDir: string;
let promptsDir: string;
let outputPath: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(tmpdir(), 'prompt-render-'));
  promptsDir = path.join(tempDir, 'prompts');
  outputPath = path.join(tempDir, 'generatedTemplates.ts');
  await mkdir(promptsDir);
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

async function writePrompt(fileName: string) {
  await writeFile(
    path.join(promptsDir, fileName),
    `id: test-prompt
title: Test Prompt
description: Validates rendering
category: Testing
tags:
  - unit
template: |
  Review {{ topic }} and {{topic}} for {{review_notes}}.
`,
    'utf8',
  );
}

describe('renderPrompts', () => {
  it('renders valid YAML files into a generated TypeScript artifact', async () => {
    await writePrompt('valid.yaml');

    const templates = await renderPrompts({ promptsDir, outputPath });
    const generated = await readFile(outputPath, 'utf8');

    expect(templates).toHaveLength(1);
    expect(templates[0].id).toBe('test-prompt');
    expect(generated).toContain('export const generatedTemplates');
  });

  it('fails with a clear error for duplicate ids', async () => {
    await writePrompt('a.yaml');
    await writePrompt('b.yaml');

    await expect(renderPrompts({ promptsDir, outputPath, write: false })).rejects.toThrow(
      /b\.yaml: id "test-prompt" duplicates a\.yaml/,
    );
  });

  it('fails with the file and field for unexpected properties', async () => {
    await writeFile(
      path.join(promptsDir, 'invalid.yaml'),
      `id: invalid-prompt
title: Invalid Prompt
description: Invalid shape
category: Testing
tags:
  - unit
legacy: true
template: |
  Hello {{topic}}.
`,
      'utf8',
    );

    await expect(renderPrompts({ promptsDir, outputPath, write: false })).rejects.toThrow(
      /invalid\.yaml: root: Unrecognized key\(s\) in object: 'legacy'/,
    );
  });

  it('extracts variables automatically from template text', async () => {
    await writePrompt('variables.yml');

    const [template] = await renderPrompts({ promptsDir, outputPath, write: false });

    expect(template.variables).toEqual(['topic', 'review_notes']);
  });

  it('uses a typed render error for invalid prompt input', async () => {
    await writeFile(path.join(promptsDir, 'bad.yaml'), 'id: only-id\n', 'utf8');

    await expect(renderPrompts({ promptsDir, outputPath, write: false })).rejects.toBeInstanceOf(
      PromptRenderError,
    );
  });
});
