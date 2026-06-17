import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { GraphService } from './graph.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';

@UseGuards(JwtAuthGuard)
@Controller('graph')
export class GraphController {

  constructor(private graphService: GraphService) {}

  // POST /graph/link - create a link between two notes
  @Post('link')
  createLink(@Request() req, @Body() body: CreateLinkDto) {
    return this.graphService.createLink(req.user.userId, body);
  }

  // GET /graph - get full graph (all nodes and edges)
  @Get()
  getFullGraph(@Request() req) {
    return this.graphService.getFullGraph(req.user.userId);
  }

  // GET /graph/:noteId - get connections for one note
  @Get(':noteId')
  getConnections(@Param('noteId') noteId: string, @Request() req) {
    return this.graphService.getConnections(noteId, req.user.userId);
  }

  // DELETE /graph/link/:id - remove a link
  @Delete('link/:id')
  deleteLink(@Param('id') id: string, @Request() req) {
    return this.graphService.deleteLink(id, req.user.userId);
  }

}
