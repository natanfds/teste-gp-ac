/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { AssociateUserGroupDto } from './dto/associate-user-group.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { NodeDto } from '../common/dtos/node.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            associateUserWithNode: jest.fn(),
            getNodesWithUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  describe('create', () => {
    it('deve criar um usuário e retornar UserResponseDto', async () => {
      const dto: CreateUserDto = {
        name: 'Alice',
        email: 'alice@test.com',
      };
      const createdUser = { id: '1', ...dto };

      repository.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);

      // expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        ...createdUser,
        type: 'USER',
      } as UserResponseDto);
    });
  });

  describe('associateUserWithNode', () => {
    it('deve chamar o repositório para associar usuário ao grupo', async () => {
      const userId = 'user-123';
      const dto: AssociateUserGroupDto = { groupId: 'group-456' };

      repository.associateUserWithNode.mockResolvedValue(undefined);

      await service.associateUserWithNode(userId, dto);

      expect(repository.associateUserWithNode).toHaveBeenCalledWith(
        userId,
        dto,
      );
    });
  });

  describe('getUserOrganizations', () => {
    it('deve retornar apenas nós com depth > 0', async () => {
      const userId = 'user-123';
      const nodes: NodeDto[] = [
        { id: '1', name: 'Root', depth: 0 },
        { id: '2', name: 'Org1', depth: 1 },
        { id: '3', name: 'Org2', depth: 2 },
      ];

      repository.getNodesWithUserId.mockResolvedValue(nodes);

      const result = await service.getUserOrganizations(userId);

      // expect(repository.getNodesWithUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([
        { id: '2', name: 'Org1', depth: 1 },
        { id: '3', name: 'Org2', depth: 2 },
      ]);
    });
  });
});
