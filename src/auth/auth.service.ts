import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { LoginUserDto, RegisterUserDto } from './dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModule: Model<UsuarioDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;
    try {
      const existingUser = await this.usuarioModule.findOne({ email });

      if (existingUser) {
        throw new RpcException({
          status: 400,
          message: 'Usuario ya existente',
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await this.usuarioModule.create({
        email,
        password: hashedPassword,
        name,
      });

      const { _id } = newUser;

      const token = await this.signJWT({
        email,
        name,
        id: _id.toString(),
      });

      return {
        user: {
          _id,
          name,
          email,
        },
        token,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      const usuario = await this.usuarioModule.findOne({ email });

      if (!usuario) {
        throw new RpcException({
          status: 400,
          message: 'Usuario no existe',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, usuario.password);

      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'Error en contraseñas',
        });
      }

      const { _id, name } = usuario;

      const token = await this.signJWT({
        email,
        name,
        id: _id.toString(),
      });

      return {
        user: {
          _id,
          name,
          email,
        },
        token: token,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
