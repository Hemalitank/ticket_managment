import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { RoleName, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(createTicketDto: CreateTicketDto, userId: number) {
        return this.prisma.ticket.create({
            data: {
                ...createTicketDto,
                created_by: userId,
                status: TicketStatus.OPEN,
            },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async findAll(user: any) {
        const { id: userId, role } = user;

        const query: any = {
            include: {
                createdBy: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            },
            orderBy: { created_at: 'desc' },
        };

        if (role === RoleName.SUPPORT) {
            query.where = { assigned_to: userId };
        } else if (role === RoleName.USER) {
            query.where = { created_by: userId };
        }

        return this.prisma.ticket.findMany(query);
    }

    async findOne(id: number, user: any) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                createdBy: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
                comments: {
                    include: { user: { select: { name: true } } },
                    orderBy: { created_at: 'asc' },
                },
                statusLogs: {
                    include: { user: { select: { name: true } } },
                    orderBy: { changed_at: 'desc' },
                },
            },
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} not found`);
        }

        if (user.role === RoleName.USER && ticket.created_by !== user.id) {
            throw new ForbiddenException('You can only view your own tickets');
        }
        if (user.role === RoleName.SUPPORT && ticket.assigned_to !== user.id) {
            throw new ForbiddenException('You can only view tickets assigned to you');
        }

        return ticket;
    }

    async assign(id: number, assignDto: AssignTicketDto) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id: assignDto.assignedToUserId },
            include: { role: true },
        });

        if (!targetUser) {
            throw new NotFoundException('User for assignment not found');
        }

        if (targetUser.role.name === RoleName.USER) {
            throw new BadRequestException('Tickets cannot be assigned to regular clients');
        }

        return this.prisma.ticket.update({
            where: { id },
            data: { assigned_to: targetUser.id },
            include: { assignedTo: { select: { name: true } } },
        });
    }

    async updateStatus(id: number, statusDto: UpdateTicketStatusDto, userId: number) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} not found`);
        }

        const oldStatus = ticket.status;
        const newStatus = statusDto.status as TicketStatus;

        const statusOrder = [
            TicketStatus.OPEN,
            TicketStatus.IN_PROGRESS,
            TicketStatus.RESOLVED,
            TicketStatus.CLOSED,
        ];

        const oldIdx = statusOrder.indexOf(oldStatus);
        const newIdx = statusOrder.indexOf(newStatus);

        if (newIdx <= oldIdx && !(oldStatus === TicketStatus.CLOSED && newStatus === TicketStatus.OPEN)) {
            throw new BadRequestException(`Invalid status transition from ${oldStatus} to ${newStatus}`);
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedTicket = await tx.ticket.update({
                where: { id },
                data: { status: newStatus },
            });

            await tx.ticketStatusLog.create({
                data: {
                    ticket_id: id,
                    old_status: oldStatus,
                    new_status: newStatus,
                    changed_by: userId,
                },
            });

            return updatedTicket;
        });
    }

    async delete(id: number) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id } });
        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} not found`);
        }
        await this.prisma.ticket.delete({ where: { id } });
        return { deleted: true };
    }
}
