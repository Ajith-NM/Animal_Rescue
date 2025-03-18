import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AddBlogRequestDto } from './dtos/request/addBlogRequest.dto';
import { BlogsService } from './blogs.service';
import { AddCommentRequestDto } from './dtos/request/addCommentRequest.dto';
import { AddReplyRequestDto } from './dtos/request/addReplayRequest.dto';
import { AddLikeRequestDto } from './dtos/request/addLikeRequest.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post('add-new-blogs')
  @UseInterceptors(FileInterceptor('file'))
  async addNewBlogs(
    @Body() body: AddBlogRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const result = await this.blogService.postAddNewBlogs(file, body);
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(400).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-new-comments')
  async addNewComments(
    @Body() body: AddCommentRequestDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.blogService.postAddNewComment(body);
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(400).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-new-reply')
  async addNewReply(@Body() body: AddReplyRequestDto, @Res() res: Response) {
    try {
      const result = await this.blogService.postAddNewReply(body);
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(400).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-new-like')
  async addNewLike(@Body() body: AddLikeRequestDto, @Res() res: Response) {
    try {
      const result = await this.blogService.postAddNewLike(body);
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(400).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-new-like')
  async getAllBlogs(@Res() res: Response) {
    try {
      const result = await this.blogService.getAllBlogs();
      if (result.status) {
        res.status(201).json(result);
      }
      res.status(400).json(result);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message: ' failed',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
