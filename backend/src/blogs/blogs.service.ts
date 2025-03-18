import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blogs, BlogsDocument } from 'src/schemas/blogs/blogs.schema';
import { UploadService } from 'src/upload/upload.service';
import { AddBlogRequestDto } from './dtos/request/addBlogRequest.dto';
import { AddCommentRequestDto } from './dtos/request/addCommentRequest.dto';
import { Comments } from 'src/schemas/blogs/comments.schema';
import { Replies } from 'src/schemas/blogs/reply.schema';
import { AddReplyRequestDto } from './dtos/request/addReplayRequest.dto';
import { AddLikeRequestDto } from './dtos/request/addLikeRequest.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blogs.name) private BlogsModel: Model<Blogs>,
    @InjectModel(Comments.name) private CommentsModel: Model<Comments>,
    @InjectModel(Replies.name) private ReplyModel: Model<Replies>,
    private readonly uploadService: UploadService,
  ) {}

  async postAddNewBlogs(file: Express.Multer.File, body: AddBlogRequestDto) {
    const uploadResponse = await this.uploadService.uploadFile(file);

    if (uploadResponse.status && uploadResponse.data.secure_url) {
      const newBlog = new this.BlogsModel({
        blog_content: body.blog_content,
        blog_title: body.blog_title,
        blog_writer: body.blog_writer,
        blog_image: uploadResponse.data.secure_url,
        blog_comments: [],
        blog_liked_Users: [],
        blog_category: body.blog_category,
      });

      const newlyAddedBlog = await newBlog.save();

      return {
        status: true,
        message: 'new Blog added',
        data: newlyAddedBlog,
      };
    }
    return {
      status: uploadResponse.status,
      message: 'file Upload failed',
      data: uploadResponse.data,
    };
  }

  async postAddNewComment(body: AddCommentRequestDto) {
    const newComment = new this.CommentsModel({
      comment_content: body.comment_content,
      comment_writer: body.comment_writer,
      comment_replies: [],
    });
    const newlyAddedComment = await newComment.save();

    await this.BlogsModel.findByIdAndUpdate(body.blog_id, {
      $push: { blog_comments: newlyAddedComment._id },
    });
    return {
      status: true,
      message: 'new comment added',
      data: newlyAddedComment,
    };
  }

  async postAddNewReply(body: AddReplyRequestDto) {
    const newReply = new this.ReplyModel({
      Replies_writer: body.reply_writer,
      Replies_content: body.reply_content,
    });
    const newlyAddedReply = await newReply.save();

    await this.CommentsModel.findByIdAndUpdate(body.comment_id, {
      $push: { comment_replies: newlyAddedReply._id },
    });
    return {
      status: true,
      message: 'new comment added',
      data: newlyAddedReply,
    };
  }

  async postAddNewLike(body: AddLikeRequestDto) {
    const liked = await this.BlogsModel.findOne({
      _id: body.blog_id,
      blog_liked_Users: body.like_user,
    });
    if (liked) {
      const likes = await this.BlogsModel.findByIdAndUpdate(
        body.blog_id,
        {
          $pull: { liked_Users: body.like_user },
        },
        { new: true },
      ).lean({});

      return {
        status: true,
        message: 'like removed',
        data: likes.blog_liked_Users.length,
      };
    }
    const likes = await this.BlogsModel.findByIdAndUpdate(body.blog_id, {
      $push: { liked_Users: body.like_user },
    }).lean({});

    return {
      status: true,
      message: 'new like added',
      data: likes.blog_liked_Users.length,
    };
  }
  async getAllBlogs() {
    const allBlogs = await this.BlogsModel.find()
      .populate('blog_writer')
      .lean<BlogsDocument>({});
    if (allBlogs) {
      return {
        status: true,
        message: 'all blogs are fetched',
        data: allBlogs,
      };
    }
    return {
      status: false,
      message: 'No blogs yet',
    };
  }
}
