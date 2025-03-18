import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from 'src/schemas/blogs/blogs.schema';
import { UploadModule } from 'src/upload/upload.module';
import { Comments, CommentsSchema } from 'src/schemas/blogs/comments.schema';
import { Replies, RepliesSchema } from 'src/schemas/blogs/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blogs.name, schema: BlogsSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: Replies.name, schema: RepliesSchema },
    ]),
    UploadModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
