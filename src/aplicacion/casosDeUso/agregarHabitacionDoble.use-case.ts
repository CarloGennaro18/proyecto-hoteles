import { HabitacionDoble } from "../../dominio/Habitacion";
import { IHotelRepository } from "../ports/IHotelRepository";
import { HotelNotFoundException } from "../../dominio/HotelExceptions";

export class AgregarHabitacionDobleUseCase {
  constructor(private hotelRepository: IHotelRepository) {}

  public async execute(
    hotelId: string, 
    datos: { numero: number; precio: number }
  ): Promise<HabitacionDoble> {
    const hotel = this.hotelRepository.obtenerHotel(hotelId);

    if (!hotel) {
      throw new HotelNotFoundException(hotelId);
    }

    // Instanciamos la habitación doble
    const nuevaHabitacion = new HabitacionDoble(datos.numero, datos.precio);

    // Agregamos al hotel (esto también vincula el hotel a la habitación internamente)
    hotel.agregarHabitacion(nuevaHabitacion);

    // Guardamos los cambios en el repositorio
    this.hotelRepository.actualizarHotel(hotel);

    return nuevaHabitacion;
  }
}