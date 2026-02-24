import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RoleName } from '@prisma/client';

@Injectable()
export class TicketCommentsService {
    private readonly logger = new Logger(TicketCommentsService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(ticketId: number, createCommentDto: CreateCommentDto, user: any) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket #${ticketId} not found`);
        }

        if (user.role === RoleName.USER && ticket.created_by !== user.id) {
            throw new ForbiddenException('You can only comment on your own tickets');
        }
        if (user.role === RoleName.SUPPORT && ticket.assigned_to !== user.id) {
            throw new ForbiddenException('You can only comment on tickets assigned to you');
        }

        return this.prisma.ticketComment.create({
            data: {
                comment: createCommentDto.comment,
                ticket_id: ticketId,
                user_id: user.id,
            },
            include: {
                user: { select: { name: true, email: true } },
            },
        });
    }

    async findByTicket(ticketId: number, user: any) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket #${ticketId} not found`);
        }

        if (user.role === RoleName.USER && ticket.created_by !== user.id) {
            throw new ForbiddenException('Access denied');
        }
        if (user.role === RoleName.SUPPORT && ticket.assigned_to !== user.id) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.ticketComment.findMany({
            where: { ticket_id: ticketId },
            include: {
                user: { select: { name: true } },
            },
            orderBy: { created_at: 'asc' },
        });
    }

    async update(id: number, updateDto: CreateCommentDto, user: any) {
        const comment = await this.prisma.ticketComment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException(`Comment #${id} not found`);
        }

        if (user.role !== RoleName.MANAGER && comment.user_id !== user.id) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        return this.prisma.ticketComment.update({
            where: { id },
            data: { comment: updateDto.comment },
        });
    }

    async remove(id: number, user: any) {
        const comment = await this.prisma.ticketComment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw new NotFoundException(`Comment #${id} not found`);
        }

        if (user.role !== RoleName.MANAGER && comment.user_id !== user.id) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.prisma.ticketComment.delete({ where: { id } });
        return { deleted: true };
    }
}
