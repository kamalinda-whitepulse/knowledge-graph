import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from '../schemas/note.schema';

describe('NotesService', () => {
  let service: NotesService;
  let mockNoteModel: any;

  const userId  = '507f1f77bcf86cd799439011';
  const noteId  = '507f1f77bcf86cd799439012';
  const fakeNote = { _id: noteId, title: 'Test', content: 'Content', tags: [], userId };

  beforeEach(async () => {
    mockNoteModel = {
      find:             jest.fn(),
      findOne:          jest.fn(),
      create:           jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getModelToken(Note.name), useValue: mockNoteModel },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllNotes', () => {
    it('should return notes for a user', async () => {
      const chain = { sort: jest.fn().mockResolvedValue([fakeNote]) };
      mockNoteModel.find.mockReturnValue(chain);
      const result = await service.getAllNotes(userId);
      expect(result).toEqual([fakeNote]);
    });
  });

  describe('getNoteById', () => {
    it('should return a note if found', async () => {
      mockNoteModel.findOne.mockResolvedValue(fakeNote);
      const result = await service.getNoteById(noteId, userId);
      expect(result).toEqual(fakeNote);
    });

    it('should throw NotFoundException if note not found', async () => {
      mockNoteModel.findOne.mockResolvedValue(null);
      await expect(service.getNoteById(noteId, userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('createNote', () => {
    it('should create and return a note', async () => {
      mockNoteModel.create.mockResolvedValue(fakeNote);
      const result = await service.createNote(userId, { title: 'Test', content: 'Content', tags: [] });
      expect(result).toEqual(fakeNote);
      expect(mockNoteModel.create).toHaveBeenCalled();
    });
  });

  describe('updateNote', () => {
    it('should update and return the note', async () => {
      const updated = { ...fakeNote, title: 'Updated' };
      mockNoteModel.findOneAndUpdate.mockResolvedValue(updated);
      const result = await service.updateNote(noteId, userId, { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException if note not found', async () => {
      mockNoteModel.findOneAndUpdate.mockResolvedValue(null);
      await expect(service.updateNote(noteId, userId, { title: 'X' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteNote', () => {
    it('should delete and return success message', async () => {
      mockNoteModel.findOneAndDelete.mockResolvedValue(fakeNote);
      const result = await service.deleteNote(noteId, userId);
      expect(result).toEqual({ message: 'Note deleted successfully' });
    });

    it('should throw NotFoundException if note not found', async () => {
      mockNoteModel.findOneAndDelete.mockResolvedValue(null);
      await expect(service.deleteNote(noteId, userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('searchNotes', () => {
    it('should return matching notes', async () => {
      mockNoteModel.find.mockResolvedValue([fakeNote]);
      const result = await service.searchNotes(userId, 'Test');
      expect(result).toEqual([fakeNote]);
      expect(mockNoteModel.find).toHaveBeenCalled();
    });
  });
});
