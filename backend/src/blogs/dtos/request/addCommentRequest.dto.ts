import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class AddCommentRequestDto {
  @ApiProperty()
  @IsString()
  comment_content: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  comment_writer: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  blog_id: string;
}
