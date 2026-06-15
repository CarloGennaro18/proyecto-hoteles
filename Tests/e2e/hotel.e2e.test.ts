import request from 'supertest';
import express from 'express';
import { initializeController } from '../../src/infraestructura/controllers';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializeController(app);

describe('E2E - Hotel API', () => {
  let hotelId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/hotel')
      .send({
        nombre: 'Hotel E2E',
        direccion: 'Av. Test 456',
        estrellas: 5,
      });
    expect(res.status).toBe(201);
    hotelId = res.body.id;
  });

  describe('Agregar habitación simple (E2E)', () => {
    it('debe responder con 201 y la habitación debe quedar registrada', async () => {
      const habitacionData = { numeroHabitacion: 101, precio: 70 };
      const resAdd = await request(app)
        .post(`/hotel/${hotelId}/habitacion-simple`)
        .send(habitacionData);
      expect(resAdd.status).toBe(201);
    });
  });

  describe('Agregar habitación doble (E2E)', () => {
    it('debe responder con 201 y la habitación debe quedar registrada', async () => {
      const habitacionData = { numeroHabitacion: 202, precio: 140 };
      const resAdd = await request(app)
        .post(`/hotel/${hotelId}/habitacion-doble`)
        .send(habitacionData);
      expect(resAdd.status).toBe(201);
    });
  });

  describe('Obtener hotel (E2E)', () => {
    it('debe devolver el hotel con los datos correctos', async () => {
      const res = await request(app).get(`/hotel/${hotelId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('nombre', 'Hotel E2E');
    });

    it('debe retornar 404 para un ID inexistente', async () => {
      const res = await request(app).get('/hotel/id-que-no-existe');
      expect(res.status).toBe(404);
    });
  });
});