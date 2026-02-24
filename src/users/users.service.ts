import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly rolesService: RolesService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const role = await this.rolesService.findByName(createUserDto.role);
        if (!role) {
            throw new NotFoundException(`Role ${createUserDto.role} not found`);
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
                role_id: role.id,
            },
            include: {
                role: true,
            },
        });

        const { password, ...result } = newUser;
        return result;
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
    }
}
