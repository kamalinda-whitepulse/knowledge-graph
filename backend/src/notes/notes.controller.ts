import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {

  constructor(private notesService: NotesService) {}

  // GET /notes
  @Get()
  getAllNotes(@Request() req) {
    return this.notesService.getAllNotes(req.user.userId);
  }

  // GET /notes/search?query=nestjs
  @Get('search')
  searchNotes(@Request() req, @Query('query') query: string) {
    if (!query?.trim()) return [];
    return this.notesService.searchNotes(req.user.userId, query);
  }

  // GET /notes/:id
  @Get(':id')
  getNoteById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.notesService.getNoteById(id, req.user.userId);
  }

  // POST /notes
  @Post()
  createNote(@Request() req, @Body() body: CreateNoteDto) {
    return this.notesService.createNote(req.user.userId, body);
  }

  // PUT /notes/:id
  @Put(':id')
  updateNote(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
    @Body() body: UpdateNoteDto
  ) {
    return this.notesService.updateNote(id, req.user.userId, body);
  }

  // DELETE /notes/:id
  @Delete(':id')
  deleteNote(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req
  ) {
    return this.notesService.deleteNote(id, req.user.userId);
  }

}
