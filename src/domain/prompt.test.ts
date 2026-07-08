import { describe, expect, it } from 'vitest';
import {
  extractTemplateVariables,
  renderTemplate,
  sortPromptTemplates,
  type PromptTemplate,
} from './prompt';

const templates: PromptTemplate[] = [
  {
    id: 'a',
    title: 'Meeting Action Map',
    description: 'Extract meeting tasks',
    template: 'Notes: {{meeting_notes}}',
    variables: ['meeting_notes'],
    category: 'Automation',
    tags: ['meeting-notes', 'workflow'],
  },
  {
    id: 'b',
    title: 'Research Brief',
    description: 'Build research questions',
    template: 'Topic: {{topic}}',
    variables: ['topic'],
    category: 'Research',
    tags: ['analysis'],
  },
];

describe('prompt domain', () => {
  it('extracts unique template variables in order', () => {
    expect(extractTemplateVariables('{{topic}} and {{ topic }} plus {{review_notes}}')).toEqual([
      'topic',
      'review_notes',
    ]);
  });

  it('renders provided values and leaves missing variables visible', () => {
    expect(renderTemplate('A {{topic}} B {{missing}}', { topic: 'Roadmap' })).toBe(
      'A Roadmap B {{missing}}',
    );
  });

  it('sorts by title and category', () => {
    expect(sortPromptTemplates(templates, 'title').map((item) => item.id)).toEqual(['a', 'b']);
    expect(sortPromptTemplates(templates, 'category').map((item) => item.id)).toEqual(['a', 'b']);
  });
});
