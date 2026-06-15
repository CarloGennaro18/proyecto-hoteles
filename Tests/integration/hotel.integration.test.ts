import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/infraestructura/controllers/agregarHabitacionSimple.use-case';
import { agregarHabitacionDobleUseCase } from '../../src/infraestructura/controllers/agregarHabitacionDoble.use-case';
import { CrearHotelDto } from '../../src/aplicacion/dtos/crearHotel.dto';
import { DatabaseNotFoundException } from '../../src/infraestructura/exceptions/DatabaseNotFoudException';

describe('Integration Tests - Hotel Flow', () => {
  let repository: MemoryHotelRepositoryImpl;
  let crearHotelUseCase: CrearHotelUseCase;
  let obtenerHotelUseCase: ObtenerHotelUseCase;

  beforeEach(() => {
    repository = new MemoryHotelRepositoryImpl();
    crearHotelUseCase = new CrearHotelUseCase(repository);
    obtenerHotelUseCase = new ObtenerHotelUseCase(repository);
  });

  const hotelDto: CrearHotelDto = {
    nombre: 'Hotel Test',
    direccion: 'Calle Falsa 123',
    estrellas: 4,
  };

  describe('Agregar habitación simple', () => {
    it('debe agregar una habitación simple a un hotel existente y persistirla', () => {
      const hotelCreado = crearHotelUseCase.execute(hotelDto);
      const hotelId = hotelCreado.getId()!;
      const habitacionData = { numeroHabitacion: 101, precio: 80 };
      const hotelAntes = obtenerHotelUseCase.execute(hotelId);
      const simpleUseCase = new agregarHabitacionSimpleUseCase();
      simpleUseCase.execute(hotelAntes, habitacionData);
      const hotelActualizado = obtenerHotelUseCase.execute(hotelId);
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const habitaciones = hotelActualizado.filtrarHabitacionesDisponibles(1, hoy, manana);
      expect(habitaciones).toHaveLength(1);
      expect(habitaciones[0]).toHaveProperty('capacidad', 1);
    });
  });

  describe('Agregar habitación doble', () => {
    it('debe agregar una habitación doble a un hotel existente y persistirla', () => {
      const hotelCreado = crearHotelUseCase.execute(hotelDto);
      const hotelId = hotelCreado.getId()!;
      const habitacionData = { numeroHabitacion: 202, precio: 120 };
      const hotelAntes = obtenerHotelUseCase.execute(hotelId);
      const dobleUseCase = new agregarHabitacionDobleUseCase();
      dobleUseCase.execute(hotelAntes, habitacionData);
      const hotelActualizado = obtenerHotelUseCase.execute(hotelId);
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const habitaciones = hotelActualizado.filtrarHabitacionesDisponibles(2, hoy, manana);
      expect(habitaciones).toHaveLength(1);
      expect(habitaciones[0]).toHaveProperty('capacidad', 2);
    });
  });

  describe('Obtener hotel', () => {
    it('debe recuperar un hotel existente por ID con todos sus datos', () => {
      const hotelCreado = crearHotelUseCase.execute(hotelDto);
      const hotelId = hotelCreado.getId()!;
      const simpleUseCase = new agregarHabitacionSimpleUseCase();
      const dobleUseCase = new agregarHabitacionDobleUseCase();
      const hotel = obtenerHotelUseCase.execute(hotelId);
      simpleUseCase.execute(hotel, { numeroHabitacion: 101, precio: 80 });
      dobleUseCase.execute(hotel, { numeroHabitacion: 202, precio: 130 });
      const hotelObtenido = obtenerHotelUseCase.execute(hotelId);
      expect(hotelObtenido.nombre).toBe(hotelDto.nombre);
      expect(hotelObtenido.getDireccion()).toBe(hotelDto.direccion);
      expect(hotelObtenido.getEstrellas()).toBe(hotelDto.estrellas);
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(hoy.getDate() + 1);
      const habitaciones = hotelObtenido.filtrarHabitacionesDisponibles(1, hoy, manana);
      expect(habitaciones).toHaveLength(2);
    });

    it('debe lanzar DatabaseNotFoundException si el ID no existe', () => {
      expect(() => obtenerHotelUseCase.execute('id-inexistente')).toThrow(DatabaseNotFoundException);
    });
  });
});