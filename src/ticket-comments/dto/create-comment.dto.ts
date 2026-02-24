import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'Comment must be at least 3 characters long' })
    comment: string;
}
