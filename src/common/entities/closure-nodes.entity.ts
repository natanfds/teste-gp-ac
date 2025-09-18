import { index } from 'drizzle-orm/pg-core';
import { integer, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { nodeEntity } from './node.entity';

export const closureNodesEntity = pgTable(
  'closure_nodes',
  {
    ancestor: uuid('ancestor')
      .notNull()
      .references(() => nodeEntity.id),
    descendant: uuid('descendant')
      .notNull()
      .references(() => nodeEntity.id),
    depth: integer('depth').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.ancestor, table.descendant] }),
    index('idx_ancestor').on(table.ancestor),
    index('idx_descendant').on(table.descendant),
  ],
);
