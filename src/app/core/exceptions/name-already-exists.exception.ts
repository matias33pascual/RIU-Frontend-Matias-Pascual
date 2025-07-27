export const DEFAULT_NAME_ALREADY_EXISTS_MESSAGE =
  'Ya existe un superhéroe con ese nombre';

export class NameAlreadyExistsException extends Error {
  constructor(message: string = DEFAULT_NAME_ALREADY_EXISTS_MESSAGE) {
    super(message);
    this.name = 'NameAlreadyExistsException';
  }
}
