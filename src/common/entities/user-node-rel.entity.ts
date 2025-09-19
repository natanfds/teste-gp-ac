import { pgTable, uuid, primaryKey, index } from 'drizzle-orm/pg-core';
import { userEntity } from '../../users/entities/user.entity';
import { nodeEntity } from '../../common/entities/node.entity';

export const userNodesRelEntity = pgTable(
  'user_nodes',
  {
    user_id: uuid('user_id')
      .notNull()
      .references(() => userEntity.id),
    node_id: uuid('node_id')
      .notNull()
      .references(() => nodeEntity.id),
  },
  (table) => [
    primaryKey({ columns: [table.user_id, table.node_id] }),
    index('idx_user_id').on(table.user_id),
  ],
);
