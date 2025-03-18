import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class AddLikeRequestDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  like_user: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  blog_id: string;
}
