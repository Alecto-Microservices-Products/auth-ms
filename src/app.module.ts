import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(envs.databaseUrl),
    AuthModule],
})
export class AppModule {}
