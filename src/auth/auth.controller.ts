import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id, role: user.role?.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
