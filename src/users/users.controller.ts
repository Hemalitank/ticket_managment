import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    // @Roles(Role.MANAGER)
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(Role.MANAGER)
    async findAll() {
        return this.usersService.findAll();
    }
}
