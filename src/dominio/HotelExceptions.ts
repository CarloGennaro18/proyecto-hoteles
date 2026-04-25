export class HotelNotFoundException extends Error {
  constructor(id: string) {
    super(`Hotel con ID ${id} no encontrado.`);
    this.name = "HotelNotFoundException";
  }
}

export class HabitacionYaExisteException extends Error {
  constructor(numero: number) {
    super(`La habitación número ${numero} ya existe en este hotel.`);
    this.name = "HabitacionYaExisteException";
  }
}

export class SinDisponibilidadException extends Error {
  constructor() {
    super("No se encontraron habitaciones disponibles para los criterios seleccionados.");
    this.name = "SinDisponibilidadException";
  }
}