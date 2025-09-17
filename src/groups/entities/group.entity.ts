import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const groupEntity = pgTable('groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parentId: uuid('parent_id').notNull(),
});
