import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let controller: NotesController;
  let mockNotesService: any;

  const mockReq  = { user: { userId: '507f1f77bcf86cd799439011' } };
  const fakeNote = { _id: 'note-id', title: 'Test', content: 'Content', tags: [] };

  beforeEach(async () => {
    mockNotesService = {
      getAllNotes:  jest.fn(),
      getNoteById: jest.fn(),
      createNote:  jest.fn(),
      updateNote:  jest.fn(),
      deleteNote:  jest.fn(),
      searchNotes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: NotesService, useValue: mockNotesService },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllNotes should call service with userId', async () => {
    mockNotesService.getAllNotes.mockResolvedValue([fakeNote]);
    const result = await controller.getAllNotes(mockReq);
    expect(mockNotesService.getAllNotes).toHaveBeenCalledWith(mockReq.user.userId);
    expect(result).toEqual([fakeNote]);
  });

  it('searchNotes should return [] for empty query', async () => {
    const result = await controller.searchNotes(mockReq, '');
    expect(result).toEqual([]);
    expect(mockNotesService.searchNotes).not.toHaveBeenCalled();
  });

  it('searchNotes should call service for a valid query', async () => {
    mockNotesService.searchNotes.mockResolvedValue([fakeNote]);
    const result = await controller.searchNotes(mockReq, 'Test');
    expect(mockNotesService.searchNotes).toHaveBeenCalledWith(mockReq.user.userId, 'Test');
    expect(result).toEqual([fakeNote]);
  });

  it('getNoteById should call service with id and userId', async () => {
    mockNotesService.getNoteById.mockResolvedValue(fakeNote);
    const result = await controller.getNoteById('note-id', mockReq);
    expect(mockNotesService.getNoteById).toHaveBeenCalledWith('note-id', mockReq.user.userId);
    expect(result).toEqual(fakeNote);
  });

  it('createNote should call service with userId and body', async () => {
    mockNotesService.createNote.mockResolvedValue(fakeNote);
    const body = { title: 'Test', content: 'Content', tags: [] };
    const result = await controller.createNote(mockReq, body);
    expect(mockNotesService.createNote).toHaveBeenCalledWith(mockReq.user.userId, body);
    expect(result).toEqual(fakeNote);
  });

  it('updateNote should call service with id, userId and body', async () => {
    const updated = { ...fakeNote, title: 'Updated' };
    mockNotesService.updateNote.mockResolvedValue(updated);
    const result = await controller.updateNote('note-id', mockReq, { title: 'Updated' });
    expect(mockNotesService.updateNote).toHaveBeenCalledWith('note-id', mockReq.user.userId, { title: 'Updated' });
    expect(result).toEqual(updated);
  });

  it('deleteNote should call service with id and userId', async () => {
    mockNotesService.deleteNote.mockResolvedValue({ message: 'Note deleted successfully' });
    const result = await controller.deleteNote('note-id', mockReq);
    expect(mockNotesService.deleteNote).toHaveBeenCalledWith('note-id', mockReq.user.userId);
    expect(result).toEqual({ message: 'Note deleted successfully' });
  });
});
