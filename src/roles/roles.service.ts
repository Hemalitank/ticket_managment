import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role as RoleEnum } from '../enums/role.enum';
import { RoleName } from '@prisma/client';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
    private readonly logger = new Logger(RolesService.name);

    constructor(private readonly prisma: PrismaService) { }

    async onApplicationBootstrap() {
        this.logger.log('Checking database roles...');

        const roleNames = Object.values(RoleEnum) as RoleName[];

        for (const name of roleNames) {
            const exists = await this.prisma.role.findUnique({
                where: { name },
            });

            if (!exists) {
                await this.prisma.role.create({
                    data: { name },
                });
                this.logger.log(`Role seeded: ${name}`);
            }
        }
    }

    async findByName(name: RoleEnum) {
        return this.prisma.role.findUnique({
            where: { name: name as RoleName },
        });
    }
}
