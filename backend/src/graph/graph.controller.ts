import { Controller, Post, Get, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GraphService } from './graph.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe';

@UseGuards(JwtAuthGuard)
@ApiTags('Graph')
@ApiBearerAuth('JWT-auth')
@Controller('graph')
export class GraphController {

  constructor(private graphService: GraphService) {}

  // POST /graph/link
  @Post('link')
  @ApiOperation({ summary: 'Create a link between two notes' })
  @ApiResponse({ status: 201, description: 'Link created successfully' })
  @ApiResponse({ status: 400, description: 'Self-link or duplicate link' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  createLink(@Request() req, @Body() body: CreateLinkDto) {
    return this.graphService.createLink(req.user.userId, body);
  }

  // GET /graph
  @Get()
  @ApiOperation({ summary: 'Get full graph — all nodes and edges' })
  @ApiResponse({ status: 200, description: 'Returns nodes and edges for React Flow' })
  getFullGraph(@Request() req) {
    return this.graphService.getFullGraph(req.user.userId);
  }

  // GET /graph/:noteId
  @Get(':noteId')
  @ApiOperation({ summary: 'Get incoming and outgoing connections for a note' })
  @ApiResponse({ status: 200, description: 'Returns incoming and outgoing links' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  getConnections(
    @Param('noteId', ParseObjectIdPipe) noteId: string,
    @Request() req
  ) {
    return this.graphService.getConnections(noteId, req.user.userId);
  }

  // DELETE /graph/link/:id
  @Delete('link/:id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiResponse({ status: 200, description: 'Link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  deleteLink(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.graphService.deleteLink(id, req.user.userId);
  }

}
