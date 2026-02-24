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
import { TicketCommentsService } from './ticket-comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketCommentsController {
    constructor(private readonly commentService: TicketCommentsService) { }

    @Post('tickets/:ticketId/comments')
    create(
        @Param('ticketId', ParseIntPipe) ticketId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentService.create(ticketId, createCommentDto, req.user);
    }

    @Get('tickets/:ticketId/comments')
    findAll(@Param('ticketId', ParseIntPipe) ticketId: number, @Request() req) {
        return this.commentService.findByTicket(ticketId, req.user);
    }

    @Patch('comments/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentService.update(id, updateDto, req.user);
    }

    @Delete('comments/:id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.commentService.remove(id, req.user);
    }
}
