import { integer, uuid, pgTable, text } from 'drizzle-orm/pg-core';

export const nodeEntity = pgTable('nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  depth: integer('depth').notNull(),
});
