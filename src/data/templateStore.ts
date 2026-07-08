import type { PromptTemplate } from '../domain/prompt';
import { generatedTemplates } from './generatedTemplates';

export function loadTemplates(): PromptTemplate[] {
  return generatedTemplates;
}
