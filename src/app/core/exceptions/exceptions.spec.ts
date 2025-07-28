import {
  DEFAULT_NAME_ALREADY_EXISTS_MESSAGE,
  DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE,
  NameAlreadyExistsException,
  SuperheroNotFoundException,
} from '@exceptions';

describe('Custom Exceptions', () => {
  describe('NameAlreadyExistsException', () => {
    it('should create with default message', () => {
      const exception = new NameAlreadyExistsException();
      expect(exception.message).toBe(DEFAULT_NAME_ALREADY_EXISTS_MESSAGE);
      expect(exception.name).toBe('NameAlreadyExistsException');
    });

    it('should create with custom message', () => {
      const customMessage = 'Custom name exists message';
      const exception = new NameAlreadyExistsException(customMessage);
      expect(exception.message).toBe(customMessage);
      expect(exception.name).toBe('NameAlreadyExistsException');
    });

    it('should be instance of Error', () => {
      const exception = new NameAlreadyExistsException();
      expect(exception instanceof Error).toBe(true);
    });
  });

  describe('SuperheroNotFoundException', () => {
    it('should create with default message', () => {
      const exception = new SuperheroNotFoundException();
      expect(exception.message).toBe(DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE);
      expect(exception.name).toBe('SuperheroNotFoundException');
    });

    it('should create with custom message', () => {
      const customMessage = 'Custom not found message';
      const exception = new SuperheroNotFoundException(customMessage);
      expect(exception.message).toBe(customMessage);
      expect(exception.name).toBe('SuperheroNotFoundException');
    });

    it('should be instance of Error', () => {
      const exception = new SuperheroNotFoundException();
      expect(exception instanceof Error).toBe(true);
    });
  });
});
