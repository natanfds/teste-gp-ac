import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: () => {
        const databaseString = process.env['DATABASE_URL'];
        const pool = new Pool({
          connectionString: databaseString,
          max: 20,
        });
        return drizzle(pool);
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
