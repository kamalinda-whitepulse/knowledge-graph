import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { Note } from '../schemas/note.schema';
import { Relationship } from '../schemas/relationship.schema';
import { BadRequestException } from '@nestjs/common';

describe('DashboardService', () => {
  let service: DashboardService;

  // chainable mock for find().sort().limit().select().lean()
  const mockFindChain = {
    sort:   jest.fn().mockReturnThis(),
    limit:  jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean:   jest.fn().mockResolvedValue([]),
  };

  const mockNoteModel = {
    countDocuments: jest.fn(),
    find:           jest.fn().mockReturnValue(mockFindChain),
    collection:     { name: 'notes' },
  };

  const mockRelationshipModel = {
    countDocuments: jest.fn(),
    aggregate:      jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getModelToken(Note.name),         useValue: mockNoteModel         },
        { provide: getModelToken(Relationship.name), useValue: mockRelationshipModel },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException for invalid userId', async () => {
    await expect(service.getDashboard('not-a-valid-id'))
      .rejects.toThrow(BadRequestException);
  });

  it('should return dashboard data for a valid userId', async () => {
    const validId = '507f1f77bcf86cd799439011';

    mockNoteModel.countDocuments.mockResolvedValue(3);
    mockRelationshipModel.countDocuments.mockResolvedValue(2);
    mockRelationshipModel.aggregate.mockResolvedValue([]);

    const result = await service.getDashboard(validId);

    expect(result).toEqual({
      totalNotes:       3,
      totalConnections: 2,
      mostConnected:    [],
      recentNotes:      [],
    });
  });

});
