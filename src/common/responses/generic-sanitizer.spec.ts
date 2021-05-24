import { sanitize } from './generic_sanitizer';

describe('GenericSanitizer', () => {
  describe('sanitize', () => {
    it('should sanitize an object.', () => {
      const input = {
        a: 1,
        b: 'test',
        c: 8.5,
      };

      class TestClass {
        a: number;
        b: string;
      }

      const template: TestClass = {
        a: 0,
        b: '',
      };

      const res = sanitize<TestClass>(input, template);

      expect(res).toEqual({ a: 1, b: 'test' });
    });
  });
});
