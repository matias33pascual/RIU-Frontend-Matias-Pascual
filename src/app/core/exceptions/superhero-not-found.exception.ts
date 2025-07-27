export const DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE = 'Superhéroe no encontrado';

export class SuperheroNotFoundException extends Error {
  constructor(message: string = DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE) {
    super(message);
    this.name = 'SuperheroNotFoundException';
  }
}
