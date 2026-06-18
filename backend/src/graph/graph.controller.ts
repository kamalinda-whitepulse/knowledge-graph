import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { GraphService } from './graph.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe';

@UseGuards(JwtAuthGuard)
@Controller('graph')
export class GraphController {

  constructor(private graphService: GraphService) {}

  // POST /graph/link
  @Post('link')
  createLink(@Request() req, @Body() body: CreateLinkDto) {
    return this.graphService.createLink(req.user.userId, body);
  }

  // GET /graph
  @Get()
  getFullGraph(@Request() req) {
    return this.graphService.getFullGraph(req.user.userId);
  }

  // GET /graph/:noteId
  @Get(':noteId')
  getConnections(
    @Param('noteId', ParseObjectIdPipe) noteId: string,
    @Request() req
  ) {
    return this.graphService.getConnections(noteId, req.user.userId);
  }

  // DELETE /graph/link/:id
  @Delete('link/:id')
  deleteLink(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.graphService.deleteLink(id, req.user.userId);
  }

}
