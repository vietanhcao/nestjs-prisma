// make a database for testing!
// Everytime we run tests, clean up data
// We must call request like we do with Postman
/**
 * how to open prisma studio on test database
 * npx dotenv -e .env.test -- prisma studio
 * how to open prisma studio on development database
 * npx dotenv -e .env -- prisma studio
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

const PORT = 3006;
describe('App EndToEnd (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    // how to delete port before listen

    await app.listen(PORT);
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
    // pactum set port
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('Test Authentication', () => {
    describe('Test Register', () => {
      it('should register validate email', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: '',
            password: '123456',
          })
          .expectStatus(400);
      });

      it('should register a user with valid credentials and return the user', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'vietanhcao@gmail.com',
            password: '123456',
          })
          .expectStatus(201);
      });
    });

    describe('Test Loggin', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: 'vietanhcao@gmail.com',
            password: '123456',
          })
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });

    describe('Test Get Profile', () => {
      it('should get profile', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .expectStatus(200)
          .stores('userId', 'id');
      });
    });
  });

  describe('Test Note', () => {
    describe('Test Create Note', () => {
      it('should create first Note', () => {
        return pactum
          .spec()
          .post(`/notes`)
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .withBody({
            title: 'my title',
            description: 'note description',
            url: 'https://www.google.com',
          })
          .expectStatus(201)
          .stores('noteId01', 'id');
      });

      it('should create second Note', () => {
        return pactum
          .spec()
          .post(`/notes`)
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .withBody({
            title: 'my title 2',
            description: 'note description 2',
            url: 'https://www.google.com 2',
          })
          .expectStatus(201)
          .stores('noteId02', 'id');
      });
    });

    it('Test get Note by id', () => {
      return pactum
        .spec()
        .get(`/notes/$S{noteId02}`)
        .withHeaders({
          Authorization: `Bearer $S{accessToken}`,
        })
        .expectStatus(200);
    });

    it('Test getall Notes', () => {
      return pactum
        .spec()
        .get(`/notes`)
        .withHeaders({
          Authorization: `Bearer $S{accessToken}`,
        })
        .expectStatus(200);
    });

    it('Test delete Note by id', () => {
      return pactum
        .spec()
        .delete(`/notes/$S{noteId02}/delete`)
        .withHeaders({
          Authorization: `Bearer $S{accessToken}`,
        })
        .expectStatus(204);
    });
  });

  afterAll(async () => {
    await app.close();
  });
  it.todo('should Pass,1');
  it.todo('should Pass,2');
});
