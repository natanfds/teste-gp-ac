import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { NodesModule } from './nodes/nodes.module';
import { DatabaseModule } from './database/database.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { APP_FILTER } from '@nestjs/core';
import { OnExceptionFilter } from './filters/onException.filter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    GroupsModule,
    NodesModule,
    DatabaseModule,
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: OnExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
