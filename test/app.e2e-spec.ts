/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.ts';
import { regexUUID } from '../src/common/constants/regex.ts';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

describe('Integração: Users & Groups (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createData = {
    name: uniqueNamesGenerator({
      dictionaries: [animals],
    }),
    email:
      uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
      }) + '@example.com',
  };

  it('POST /users deve criar um usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(createData)
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'USER',
      ...createData,
    });

    // valida se id é uuid
    expect(res.body.id).toMatch(regexUUID);
  });

  it('POST /users deve seri impedido de criar um usuário com email repetido', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(createData)
      .expect(409);
  });
});
