import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class AddReplyRequestDto {
  @ApiProperty()
  @IsString()
  reply_content: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  reply_writer: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  comment_id: string;
}
