import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class AddBlogRequestDto {
  @ApiProperty()
  @IsString()
  blog_title: string;

  @ApiProperty()
  @IsString()
  blog_content: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  blog_writer: string;

  @ApiProperty()
  @IsString()
  blog_category: string;
}
