import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseIntPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(Role.USER, Role.MANAGER)
    create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
        return this.ticketsService.create(createTicketDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.ticketsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.ticketsService.findOne(id, req.user);
    }

    @Patch(':id/assign')
    @Roles(Role.MANAGER, Role.SUPPORT)
    assign(@Param('id', ParseIntPipe) id: number, @Body() assignDto: AssignTicketDto) {
        return this.ticketsService.assign(id, assignDto);
    }

    @Patch(':id/status')
    @Roles(Role.MANAGER, Role.SUPPORT)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() statusDto: UpdateTicketStatusDto,
        @Request() req,
    ) {
        return this.ticketsService.updateStatus(id, statusDto, req.user.id);
    }

    @Delete(':id')
    @Roles(Role.MANAGER)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.delete(id);
    }
}
