import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe';

@ApiTags('Notes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {

  constructor(private notesService: NotesService) {}

  // GET /notes
  @Get()
  @ApiOperation({ summary: 'Get all notes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns array of notes' })
  getAllNotes(@Request() req) {
    return this.notesService.getAllNotes(req.user.userId);
  }

  // GET /notes/search?query=nestjs
  @Get('search')
  @ApiOperation({ summary: 'Search notes by title, content or tags' })
  @ApiQuery({ name: 'query', required: true, description: 'Search keyword' })
  @ApiResponse({ status: 200, description: 'Returns array of matching notes' })
  searchNotes(@Request() req, @Query('query') query: string) {
    // guard against missing or empty query param
    if (!query?.trim()) return [];
    return this.notesService.searchNotes(req.user.userId, query);
  }

  // GET /notes/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get one note by ID' })
  @ApiResponse({ status: 200, description: 'Returns the note' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  getNoteById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.notesService.getNoteById(id, req.user.userId);
  }

  // POST /notes
  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  createNote(@Request() req, @Body() body: CreateNoteDto) {
    return this.notesService.createNote(req.user.userId, body);
  }

  // PUT /notes/:id
  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  updateNote(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
    @Body() body: UpdateNoteDto
  ) {
    return this.notesService.updateNote(id, req.user.userId, body);
  }

  // DELETE /notes/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  deleteNote(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.notesService.deleteNote(id, req.user.userId);
  }

}
