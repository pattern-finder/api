import { Phase } from '../language.schema';

export class InsertLanguageDTO {
  name: string;

  mainFileName: string;

  phases: Phase[];
}
