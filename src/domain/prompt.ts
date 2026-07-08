import { z } from 'zod';

export const promptTemplateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  template: z.string().min(1),
  variables: z.array(z.string()),
  category: z.string().min(1),
  tags: z.array(z.string()),
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;
export type PromptSort = 'title' | 'category';

export function extractTemplateVariables(template: string): string[] {
  const matches = [...template.matchAll(/{{\s*([a-zA-Z0-9_ -]+)\s*}}/g)];
  const normalized = matches
    .map((match) => match[1]?.trim().replaceAll(' ', '_'))
    .filter((name): name is string => Boolean(name));
  return [...new Set(normalized)];
}

export function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/{{\s*([a-zA-Z0-9_ -]+)\s*}}/g, (_, rawName: string) => {
    const name = rawName.trim().replaceAll(' ', '_');
    const value = values[name];
    return value?.trim() ? value.trim() : `{{${name}}}`;
  });
}

export function normalizeTemplate(template: Omit<PromptTemplate, 'variables'>): PromptTemplate {
  return {
    ...template,
    variables: extractTemplateVariables(template.template),
  };
}

export function sortPromptTemplates(
  templates: PromptTemplate[],
  sort: PromptSort,
): PromptTemplate[] {
  return [...templates].sort((a, b) => {
    if (sort === 'category') {
      const categoryOrder = a.category.localeCompare(b.category, 'de');
      return categoryOrder || a.title.localeCompare(b.title, 'de');
    }
    return a.title.localeCompare(b.title, 'de');
  });
}

export function createTemplateId(title: string) {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 48);
  return `${slug || 'template'}-${crypto.randomUUID().slice(0, 8)}`;
}
