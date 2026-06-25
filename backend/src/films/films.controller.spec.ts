import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    findSchedule: jest.fn().mockResolvedValue({ total: 0, items: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call filmsService.findAll and return result', async () => {
      const mockResult = {
        total: 2,
        items: [
          { id: '1', title: 'Агент 007' },
          { id: '2', title: 'Матрица' },
        ],
      };
      mockFilmsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should return empty list when no films', async () => {
      const mockResult = { total: 0, items: [] };
      mockFilmsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('findSchedule', () => {
    it('should call filmsService.findSchedule with film id', async () => {
      const filmId = '123';
      const mockResult = {
        total: 1,
        items: [{ id: '1', datetime: '2026-06-22T19:00:00Z' }],
      };
      mockFilmsService.findSchedule.mockResolvedValue(mockResult);

      const result = await controller.findSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledTimes(1);
      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(mockResult);
    });

    it('should pass id as string parameter', async () => {
      const filmId = 'abc-def-456';
      mockFilmsService.findSchedule.mockResolvedValue({ total: 0, items: [] });

      await controller.findSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledWith('abc-def-456');
    });

    it('should return empty schedule when no sessions', async () => {
      const mockResult = { total: 0, items: [] };
      mockFilmsService.findSchedule.mockResolvedValue(mockResult);

      const result = await controller.findSchedule('999');

      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });
  });
});
