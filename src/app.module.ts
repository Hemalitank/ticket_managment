import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketCommentsModule } from './ticket-comments/ticket-comments.module';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    TicketsModule,
    TicketCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
