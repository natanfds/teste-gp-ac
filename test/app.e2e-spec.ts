/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { regexUUID } from '../src/common/constants/regex';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateGroupDto } from 'src/groups/dto/create-group.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { GroupResponseDto } from 'src/groups/dto/group-response.dto';

function generateCreateUserDto(): CreateUserDto {
  return {
    name: uniqueNamesGenerator({
      dictionaries: [animals, colors],
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
      dictionaries: [animals, colors],
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

  const parentGroupData = generateCreateGroupDto();

  const childGroupData = generateCreateGroupDto();

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

  it('POST /groups deve criar grupo sem parentId', async () => {
    const res = await request(app.getHttpServer())
      .post('/groups')
      .send(parentGroupData)
      .expect(201);

    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'GROUP',
      name: parentGroupData.name,
      parentId: null,
    });
  });

  const createdGroups: GroupResponseDto[] = [];
  it('POST /groups deve criar grupo com parentId', async () => {
    // cria parent
    const parent = await request(app.getHttpServer())
      .post('/groups')
      .send(parentGroupData)
      .expect(201);

    idGroupParent = parent.body.id;
    createdGroups.push(parent.body);
    const res = await request(app.getHttpServer())
      .post('/groups')
      .send({ name: childGroupData.name, parentId: idGroupParent })
      .expect(201);

    createdGroups.push(res.body);
    expect(res.body).toEqual({
      id: expect.any(String),
      type: 'GROUP',
      name: childGroupData.name,
      parentId: expect.any(String),
    });
  });

  let userWithGroupsAssociateds: UserResponseDto;
  it('POST /users/:id/groups deve associar usuário ao grupo', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send(generateCreateUserDto());

    userWithGroupsAssociateds = user.body;

    await request(app.getHttpServer())
      .post(`/users/${user.body.id}/groups`)
      .send({ groupId: (createdGroups[1] as GroupResponseDto).id })
      .expect(204);
  });

  it('POST /users/:id/groups não deve permitir uma associação repetida', async () => {
    await request(app.getHttpServer())
      .post(`/users/${userWithGroupsAssociateds.id}/groups`)
      .send({ groupId: (createdGroups[1] as GroupResponseDto).id })
      .expect(409);
  });

  it('GET /users/:id/organizations deve retornar grupos associados (diretos e herdados)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userWithGroupsAssociateds.id}/organizations`)
      .expect(200);

    expect(res.body).toEqual(
      createdGroups
        .reverse()
        .map((g, i) => ({ id: g.id, name: g.name, depth: i + 1 })),
    );
  });

  it('GET /nodes/:id/ancestors deve listar ancestrais', async () => {
    const res = await request(app.getHttpServer())
      .get(`/nodes/${(createdGroups[0] as GroupResponseDto).id}/ancestors`)
      .expect(200);

    expect(res.body).toEqual(
      createdGroups
        .map((g, i) => {
          return {
            id: g.id,
            name: g.name,
            depth: i + 1,
          };
        })
        .reverse(),
    );
  });

  it('GET /nodes/:id/descendants deve listar descendentes', async () => {
    const res = await request(app.getHttpServer())
      .get(`/nodes/${(createdGroups[1] as GroupResponseDto).id}/descendants`)
      .expect(200);

    expect(res.body).toEqual(
      createdGroups.reverse().map((g, i) => {
        return {
          id: g.id,
          name: g.name,
          depth: i + 1,
        };
      }),
    );
  });
});
