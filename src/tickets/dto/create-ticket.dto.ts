import { IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { TicketPriority } from '../../enums/ticket-priority.enum';

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Title must be at least 5 characters long' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    description: string;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;
}
