import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GraphService } from './graph.service';
import { Relationship, RelationshipType } from '../schemas/relationship.schema';
import { Note } from '../schemas/note.schema';

describe('GraphService', () => {
  let service: GraphService;
  let mockRelationshipModel: any;
  let mockNoteModel: any;

  const userId   = '507f1f77bcf86cd799439011';
  const noteIdA  = '507f1f77bcf86cd799439012';
  const noteIdB  = '507f1f77bcf86cd799439013';
  const linkId   = '507f1f77bcf86cd799439014';
  const fakeNoteA = { _id: noteIdA, title: 'Note A', tags: [], userId };
  const fakeNoteB = { _id: noteIdB, title: 'Note B', tags: [], userId };
  const fakeLink  = { _id: linkId, fromNoteId: noteIdA, toNoteId: noteIdB, type: RelationshipType.RELATED_TO, userId };

  beforeEach(async () => {
    const populateChain = { populate: jest.fn().mockResolvedValue([]) };

    mockNoteModel = {
      findOne: jest.fn(),
      find:    jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) }),
    };

    mockRelationshipModel = {
      findOne:          jest.fn(),
      find:             jest.fn().mockReturnValue(populateChain),
      create:           jest.fn(),
      findOneAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        { provide: getModelToken(Relationship.name), useValue: mockRelationshipModel },
        { provide: getModelToken(Note.name),         useValue: mockNoteModel         },
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLink', () => {
    it('should throw BadRequestException if fromNoteId === toNoteId', async () => {
      await expect(service.createLink(userId, { fromNoteId: noteIdA, toNoteId: noteIdA, type: RelationshipType.RELATED_TO }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if source note not found', async () => {
      mockNoteModel.findOne.mockResolvedValueOnce(null);
      await expect(service.createLink(userId, { fromNoteId: noteIdA, toNoteId: noteIdB, type: RelationshipType.RELATED_TO }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if target note not found', async () => {
      mockNoteModel.findOne.mockResolvedValueOnce(fakeNoteA).mockResolvedValueOnce(null);
      await expect(service.createLink(userId, { fromNoteId: noteIdA, toNoteId: noteIdB, type: RelationshipType.RELATED_TO }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if link already exists', async () => {
      mockNoteModel.findOne.mockResolvedValueOnce(fakeNoteA).mockResolvedValueOnce(fakeNoteB);
      mockRelationshipModel.findOne.mockResolvedValue(fakeLink);
      await expect(service.createLink(userId, { fromNoteId: noteIdA, toNoteId: noteIdB, type: RelationshipType.RELATED_TO }))
        .rejects.toThrow(BadRequestException);
    });

    it('should create and return the link', async () => {
      mockNoteModel.findOne.mockResolvedValueOnce(fakeNoteA).mockResolvedValueOnce(fakeNoteB);
      mockRelationshipModel.findOne.mockResolvedValue(null);
      mockRelationshipModel.create.mockResolvedValue(fakeLink);
      const result = await service.createLink(userId, { fromNoteId: noteIdA, toNoteId: noteIdB, type: RelationshipType.RELATED_TO });
      expect(result).toEqual(fakeLink);
    });
  });

  describe('getConnections', () => {
    it('should throw NotFoundException if note not found', async () => {
      mockNoteModel.findOne.mockResolvedValue(null);
      await expect(service.getConnections(noteIdA, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should return incoming and outgoing connections', async () => {
      mockNoteModel.findOne.mockResolvedValue(fakeNoteA);
      const populateChain = { populate: jest.fn().mockResolvedValue([]) };
      mockRelationshipModel.find.mockReturnValue(populateChain);
      const result = await service.getConnections(noteIdA, userId);
      expect(result).toHaveProperty('incoming');
      expect(result).toHaveProperty('outgoing');
    });
  });

  describe('deleteLink', () => {
    it('should throw NotFoundException if link not found', async () => {
      mockRelationshipModel.findOneAndDelete.mockResolvedValue(null);
      await expect(service.deleteLink(linkId, userId))
        .rejects.toThrow(NotFoundException);
    });

    it('should delete and return success message', async () => {
      mockRelationshipModel.findOneAndDelete.mockResolvedValue(fakeLink);
      const result = await service.deleteLink(linkId, userId);
      expect(result).toEqual({ message: 'Link deleted successfully' });
    });
  });

  describe('getFullGraph', () => {
    it('should return nodes and edges', async () => {
      mockNoteModel.find.mockReturnValue({ select: jest.fn().mockResolvedValue([fakeNoteA]) });
      mockRelationshipModel.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([fakeLink]) });
      // override find to return plain array for relationships
      mockRelationshipModel.find.mockResolvedValue([fakeLink]);
      mockNoteModel.find.mockReturnValue({ select: jest.fn().mockResolvedValue([fakeNoteA]) });
      const result = await service.getFullGraph(userId);
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
    });
  });
});
