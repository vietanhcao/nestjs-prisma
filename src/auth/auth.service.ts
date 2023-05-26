import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { AuthDTO } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: AuthDTO) {
    const hashedPassword = await argon2.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashedPassword,
          lastName: '',
        },
        // only select id, email, createdAt
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Error in credentials');
      }
      return { error };
    }
  }

  async login(dto: AuthDTO) {
    // find user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Error in credentials');
    }
    const passwordMatch = await argon2.verify(
      user.hashedPassword,
      dto.password,
    );
    if (!passwordMatch) {
      throw new ForbiddenException('Error in credentials');
    }
    delete user.hashedPassword;
    return this.convertToJwtString(user.id, user.email);
  }

  async convertToJwtString(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    const jwt = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return { accessToken: jwt };
  }
}
