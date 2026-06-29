import { Test, TestingModule } from '@nestjs/testing';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { RelationshipType } from '../schemas/relationship.schema';

describe('GraphController', () => {
  let controller: GraphController;
  let mockGraphService: any;

  const mockReq = { user: { userId: '507f1f77bcf86cd799439011' } };
  const fakeLink = { _id: 'link-id', fromNoteId: 'note-a', toNoteId: 'note-b', type: RelationshipType.RELATED_TO };

  beforeEach(async () => {
    mockGraphService = {
      createLink:     jest.fn(),
      getFullGraph:   jest.fn(),
      getConnections: jest.fn(),
      deleteLink:     jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphController],
      providers: [
        { provide: GraphService, useValue: mockGraphService },
      ],
    }).compile();

    controller = module.get<GraphController>(GraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createLink should call service with userId and body', async () => {
    mockGraphService.createLink.mockResolvedValue(fakeLink);
    const body = { fromNoteId: 'note-a', toNoteId: 'note-b', type: RelationshipType.RELATED_TO };
    const result = await controller.createLink(mockReq, body);
    expect(mockGraphService.createLink).toHaveBeenCalledWith(mockReq.user.userId, body);
    expect(result).toEqual(fakeLink);
  });

  it('getFullGraph should call service with userId', async () => {
    const graph = { nodes: [], edges: [] };
    mockGraphService.getFullGraph.mockResolvedValue(graph);
    const result = await controller.getFullGraph(mockReq);
    expect(mockGraphService.getFullGraph).toHaveBeenCalledWith(mockReq.user.userId);
    expect(result).toEqual(graph);
  });

  it('getConnections should call service with noteId and userId', async () => {
    const connections = { incoming: [], outgoing: [] };
    mockGraphService.getConnections.mockResolvedValue(connections);
    const result = await controller.getConnections('note-a', mockReq);
    expect(mockGraphService.getConnections).toHaveBeenCalledWith('note-a', mockReq.user.userId);
    expect(result).toEqual(connections);
  });

  it('deleteLink should call service with id and userId', async () => {
    mockGraphService.deleteLink.mockResolvedValue({ message: 'Link deleted successfully' });
    const result = await controller.deleteLink('link-id', mockReq);
    expect(mockGraphService.deleteLink).toHaveBeenCalledWith('link-id', mockReq.user.userId);
    expect(result).toEqual({ message: 'Link deleted successfully' });
  });
});
