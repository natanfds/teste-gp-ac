import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupRepository } from './repositories/group.repository';
import { ClosureRepository } from 'src/common/repositories/closure.repository';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, GroupRepository, ClosureRepository],
})
export class GroupsModule {}
