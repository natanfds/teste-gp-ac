import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env['PORT']) || 3000;
  console.log(`Running at: http://0.0.0.0:${port}`);
  await app.listen(port);
}

void bootstrap();
