import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { NewUserDTO } from './dtos/new-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    delete user.password;
    return user;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ user });
    return { token };
  }

  async register(payload: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { firstName, lastName, email, password } = payload;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('An account with that email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete newUser.password;
    return newUser;
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);

      return { exp };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
