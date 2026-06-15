import { Hotel } from '../../src/dominio/Hotel';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion';
import { Cliente } from '../../src/dominio/Cliente';

describe('Hotel - Unit Tests', () => {
  let hotel: Hotel;
  const hotelData = {
    nombre: 'Gran Hotel Plaza',
    direccion: 'Av. Siempreviva 123',
    estrellas: 5,
  };

  beforeEach(() => {
    hotel = new Hotel(null, hotelData.nombre, hotelData.direccion, hotelData.estrellas);
  });

  describe('Constructor e inicialización', () => {
    it('debe crear un hotel con los datos correctos y generar un ID automáticamente', () => {
      expect(hotel.getId()).toBeDefined();
      expect(hotel.nombre).toBe(hotelData.nombre);
      expect(hotel.getDireccion()).toBe(hotelData.direccion);
      expect(hotel.getEstrellas()).toBe(hotelData.estrellas);
    });

    it('debe respetar el ID si se provee uno en el constructor', () => {
      const customId = 'hotel-123';
      const hotelConId = new Hotel(customId, 'Otro Hotel', 'Calle Falsa 456', 4);
      expect(hotelConId.getId()).toBe(customId);
    });
  });

  describe('Gestión de habitaciones', () => {
    it('debe agregar una habitación simple y enlazarla al hotel', () => {
      const habitacion = new HabitacionSimple(101, 100);
      hotel.agregarHabitacion(habitacion);
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date(), new Date());
      expect(disponibles).toContain(habitacion);
      expect(disponibles).toHaveLength(1);
    });

    it('debe agregar una habitación doble y enlazarla al hotel', () => {
      const habitacion = new HabitacionDoble(201, 150);
      hotel.agregarHabitacion(habitacion);
      const disponibles = hotel.filtrarHabitacionesDisponibles(2, new Date(), new Date());
      expect(disponibles).toContain(habitacion);
    });
  });

  describe('Filtrado de habitaciones disponibles', () => {
    let habitacionSimple: HabitacionSimple;
    let habitacionDoble: HabitacionDoble;
    let cliente: Cliente;

    beforeEach(() => {
      habitacionSimple = new HabitacionSimple(101, 100);
      habitacionDoble = new HabitacionDoble(201, 150);
      hotel.agregarHabitacion(habitacionSimple);
      hotel.agregarHabitacion(habitacionDoble);
      cliente = new Cliente('Juan', 'Pérez', 'juan@example.com');
    });

    it('debe retornar todas las habitaciones si tienen capacidad suficiente y están libres', () => {
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, hoy, manana);
      expect(disponibles).toHaveLength(2);
    });

    it('debe filtrar por capacidad mínima (capacidad 2 -> solo doble)', () => {
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const disponibles = hotel.filtrarHabitacionesDisponibles(2, hoy, manana);
      expect(disponibles).toHaveLength(1);
      expect(disponibles[0]).toBe(habitacionDoble);
    });

    it('no debe incluir habitaciones reservadas en el rango de fechas', () => {
      const fechaInicio = new Date(2025, 5, 1);
      const fechaFin = new Date(2025, 5, 5);
      habitacionSimple.reservar(cliente, fechaInicio, fechaFin);
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, fechaInicio, fechaFin);
      expect(disponibles).not.toContain(habitacionSimple);
      expect(disponibles).toContain(habitacionDoble);
    });

    it('debe respetar la disponibilidad parcial (reserva no solapa, habitación sigue disponible)', () => {
      const reservaInicio = new Date(2025, 5, 10);
      const reservaFin = new Date(2025, 5, 15);
      habitacionSimple.reservar(cliente, reservaInicio, reservaFin);
      const consultaInicio = new Date(2025, 5, 1);
      const consultaFin = new Date(2025, 5, 5);
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, consultaInicio, consultaFin);
      expect(disponibles).toContain(habitacionSimple);
    });
  });
});