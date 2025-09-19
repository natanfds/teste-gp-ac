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
import { CreateUserDto } from 'src/users/dto/create-user.dto.ts';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto.ts';

function generateCreateUserDto(): CreateUserDto {
  return {
    name: uniqueNamesGenerator({
      dictionaries: [animals],
    }),
    email:
      uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
      }) + '@example.com',
  };
}

function generateCreateGroupDto(): CreateGroupDto {
  return {
    name: uniqueNamesGenerator({
      dictionaries: [animals],
    }),
  };
}

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

  const createUserData = generateCreateUserDto();

  const firstGroupData = generateCreateGroupDto();

  const secondGroupData = generateCreateGroupDto();

  it('POST /users deve criar um usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(createUserData)
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'USER',
      ...createUserData,
    });

    // valida se id é uuid
    expect(res.body.id).toMatch(regexUUID);
  });

  it('POST /users deve ser impedido de criar um usuário com email repetido', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(createUserData)
      .expect(409);
  });

  let idGroupParent: string;
  let idGroupChild: string;

  it('POST /groups deve criar grupo sem parentId', async () => {
    const res = await request(app.getHttpServer())
      .post('/groups')
      .send(firstGroupData)
      .expect(201);

    idGroupChild = res.body.id;

    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'GROUP',
      name: firstGroupData.name,
      parentId: null,
    });
  });

  it('POST /groups deve criar grupo com parentId', async () => {
    // cria parent
    const parent = await request(app.getHttpServer())
      .post('/groups')
      .send(secondGroupData)
      .expect(201);

    idGroupParent = parent.body.id;

    const res = await request(app.getHttpServer())
      .post('/groups')
      .send({ name: firstGroupData.name, parentId: idGroupParent })
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'GROUP',
      name: firstGroupData.name,
      parentId: expect.any(String),
    });
  });

  it('POST /users/:id/groups deve associar usuário ao grupo', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send(generateCreateUserDto());

    const group = await request(app.getHttpServer())
      .post('/groups')
      .send(generateCreateGroupDto());

    await request(app.getHttpServer())
      .post(`/users/${user.body.id}/groups`)
      .send({ groupId: group.body.id })
      .expect(204);
  });
});
