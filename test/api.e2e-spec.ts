import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let managerToken: string;
  let supportToken: string;
  let userToken: string;
  let ticketId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // Seed data
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  const seedDatabase = async () => {
    // Create roles
    const managerRole = await prisma.role.upsert({
      where: { name: 'MANAGER' },
      update: {},
      create: { name: 'MANAGER' },
    });

    const supportRole = await prisma.role.upsert({
      where: { name: 'SUPPORT' },
      update: {},
      create: { name: 'SUPPORT' },
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: { name: 'USER' },
    });

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: 'manager@test.com' },
      update: {},
      create: {
        name: 'Manager',
        email: 'manager@test.com',
        password: hashedPassword,
        role_id: managerRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'support@test.com' },
      update: {},
      create: {
        name: 'Support',
        email: 'support@test.com',
        password: hashedPassword,
        role_id: supportRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        name: 'User',
        email: 'user@test.com',
        password: hashedPassword,
        role_id: userRole.id,
      },
    });
  };

  describe('Auth', () => {
    it('should login manager', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'manager@test.com',
          password: 'password123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          managerToken = res.body.access_token;
        });
    });

    it('should login support', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'support@test.com',
          password: 'password123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          supportToken = res.body.access_token;
        });
    });

    it('should login user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@test.com',
          password: 'password123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('access_token');
          userToken = res.body.access_token;
        });
    });
  });

  describe('Users', () => {
    it('should create user (manager)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          name: 'New User',
          email: 'newuser123@test.com',
          password: 'password123',
          role: 'USER',
        })
        .expect(201);
    });

    it('should get all users (manager)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should deny create user (user)', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Another User',
          email: 'another@test.com',
          password: 'password123',
          role: 'USER',
        })
        .expect(403);
    });
  });

  describe('Tickets', () => {
    it('should create ticket (user)', () => {
      return request(app.getHttpServer())
        .post('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Test Ticket',
          description: 'This is a test ticket',
          priority: 'HIGH',
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          ticketId = res.body.id;
        });
    });

    it('should get tickets (user)', () => {
      return request(app.getHttpServer())
        .get('/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should assign ticket (manager)', () => {
      return request(app.getHttpServer())
        .patch(`/tickets/${ticketId}/assign`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          assignedToUserId: 2, // support user id
        })
        .expect(200);
    });

    it('should update ticket status (support)', () => {
      return request(app.getHttpServer())
        .patch(`/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${supportToken}`)
        .send({
          status: 'IN_PROGRESS',
        })
        .expect(200);
    });
  });

  describe('Comments', () => {
    it('should create comment (user)', () => {
      return request(app.getHttpServer())
        .post(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          comment: 'This is a test comment',
        })
        .expect(201);
    });

    it('should get comments (user)', () => {
      return request(app.getHttpServer())
        .get(`/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});