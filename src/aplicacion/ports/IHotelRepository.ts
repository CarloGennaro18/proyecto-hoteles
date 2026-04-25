import { Hotel } from "../../dominio/Hotel";

export interface IHotelRepository {
  crearHotel(hotel: Hotel): Hotel;
  obtenerHotel(id: string): Hotel | null;
  actualizarHotel(hotel: Hotel): void; // para guardar la nueva habitacio
}
