import { ParseObjectIdPipe } from '../common/parse-object-id.pipe';

// GET /notes/:id
@Get(':id')
getNoteById(
  @Param('id', ParseObjectIdPipe) id: string,
  @Request() req
) {
  return this.notesService.getNoteById(id, req.user.userId);
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
