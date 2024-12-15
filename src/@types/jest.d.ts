import {} from 'jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      notificationContainsErrorMessages(expected: Array<string | { [key: string]: string[] }>): R;
    }
  }
}
