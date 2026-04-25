import { Habitacion } from "../../dominio/Habitacion";
import { IHotelRepository } from "../ports/IHotelRepository";
import { HotelNotFoundException, SinDisponibilidadException } from "../../dominio/HotelExceptions";

interface FiltrosBusqueda {
  capacidad: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export class FiltrarHabitacionesDisponiblesUseCase {
  constructor(private hotelRepository: IHotelRepository) {}

  public async execute(hotelId: string, filtros: FiltrosBusqueda): Promise<Habitacion[]> {
    const hotel = this.hotelRepository.obtenerHotel(hotelId);

    if (!hotel) {
      throw new HotelNotFoundException(hotelId);
    }

    // Usamos el método que ya definiste en Hotel.ts
    const habitacionesLibres = hotel.filtrarHabitacionesDisponibles(
      filtros.capacidad,
      filtros.fechaInicio,
      filtros.fechaFin
    );

    if (habitacionesLibres.length === 0) {
      throw new SinDisponibilidadException();
    }

    return habitacionesLibres;
  }
}