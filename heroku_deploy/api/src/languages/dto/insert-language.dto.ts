import { Phase } from '../language.schema';

export class InsertLanguageDTO {
  name: string;

  extension: string;

  phases: Phase[];
}
