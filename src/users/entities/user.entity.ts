import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const userEntity = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});
