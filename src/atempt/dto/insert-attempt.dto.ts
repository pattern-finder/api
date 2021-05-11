import { Language } from "../attempt.schema";

export class InsertAttemptDTO {
  user: string;

  challenge: string;

  code: string;

  language: Language;
}
