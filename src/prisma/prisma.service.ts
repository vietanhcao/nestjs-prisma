import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }
  cleanDatabase() {
    // In a 1 - N relation, delete the N firstly, then delete "1"
    return this.$transaction([
      // 2 command in one trasaction
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
