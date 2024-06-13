import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Usuario.name,
        schema: UsuarioSchema
      }
    ]),
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions:{expiresIn: '2h'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
