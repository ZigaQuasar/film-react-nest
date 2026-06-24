import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrder: jest.fn().mockResolvedValue({ total: 0, items: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: mockOrderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call orderService.createOrder with dto and return result', async () => {
       const dto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            film: '550e8400-e29b-41d4-a716-446655440001',
            session: '550e8400-e29b-41d4-a716-446655440002',
            daytime: '2026-06-22T19:00:00Z',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            film: '550e8400-e29b-41d4-a716-446655440001',
            session: '550e8400-e29b-41d4-a716-446655440002',
            daytime: '2026-06-22T19:00:00Z',
            row: 1,
            seat: 6,
            price: 350,
          },
        ],
      };

      const mockResult = {
        total: 2,
        items: [
          {
            id: 'ticket-1',
            film: '550e8400-e29b-41d4-a716-446655440001',
            session: '550e8400-e29b-41d4-a716-446655440002',
            daytime: '2026-06-22T19:00:00Z',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'ticket-2',
            film: '550e8400-e29b-41d4-a716-446655440001',
            session: '550e8400-e29b-41d4-a716-446655440002',
            daytime: '2026-06-22T19:00:00Z',
            row: 1,
            seat: 6,
            price: 350,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(mockResult);

      const result = await controller.createOrder(dto);

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
      expect(mockOrderService.createOrder).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResult);
    });

    it('should pass dto without modification', async () => {
      const dto: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+79998887766',
        tickets: [
          {
            film: '550e8400-e29b-41d4-a716-446655440003',
            session: '550e8400-e29b-41d4-a716-446655440004',
            daytime: '2026-06-23T21:00:00Z',
            row: 2,
            seat: 3,
            price: 400,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue({ total: 1, items: [] });

      await controller.createOrder(dto);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(dto);
      expect(mockOrderService.createOrder.mock.calls[0][0]).toBe(dto);
    });

    it('should handle empty tickets array', async () => {
      const dto: CreateOrderDto = {
        email: 'empty@example.com',
        phone: '+79990000000',
        tickets: [],
      };
      const mockResult = { total: 0, items: [] };
      mockOrderService.createOrder.mockResolvedValue(mockResult);

      const result = await controller.createOrder(dto);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(dto);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should return result from service as-is', async () => {
      const dto: CreateOrderDto = {
        email: 'test@test.com',
        phone: '+79991112233',
        tickets: [
          {
            film: '550e8400-e29b-41d4-a716-446655440005',
            session: '550e8400-e29b-41d4-a716-446655440006',
            daytime: '2026-06-24T18:30:00Z',
            row: 3,
            seat: 4,
            price: 300,
          },
        ],
      };
      const mockResult = {
        total: 1,
        items: [
          {
            id: 'ticket-1',
            film: '550e8400-e29b-41d4-a716-446655440005',
            session: '550e8400-e29b-41d4-a716-446655440006',
            daytime: '2026-06-24T18:30:00Z',
            row: 3,
            seat: 4,
            price: 300,
          },
        ],
      };
      mockOrderService.createOrder.mockResolvedValue(mockResult);

      const result = await controller.createOrder(dto);

      expect(result).toBe(mockResult);
    });
  });
});
