import { JsonLogger } from "./json.logger"

describe('JsonLogger', () => {
  let logger: JsonLogger;
  const consoleSpies = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    debug: jest.spyOn(console, 'debug').mockImplementation(),
  };

  beforeEach(() => {
    logger = new JsonLogger;
    Object.values(consoleSpies).forEach(spy => spy.mockClear());
  })

  afterAll(() => {
    Object.values(consoleSpies).forEach(spy => spy.mockRestore());
  })

  test.each([
    ['log', 'log'],
    ['error', 'error'],
    ['warn', 'warn'],
    ['debug', 'debug'],
    ['verbose', 'log'],
  ])('should format %s message as JSON', (method, consoleMethod) => {
    const loggerMethod = logger[method as keyof JsonLogger] as Function;
    loggerMethod.call(logger, 'test message');

    const spy = consoleSpies[consoleMethod as keyof typeof consoleSpies];
    expect(spy).toHaveBeenCalledTimes(1);

    const loggedMessage = spy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe(method);
    expect(parsed.message).toBe('test message');
  });

  it('should include optional params in JSON output', () => {
    logger.log('user created', { userId: 123 });
    
    const loggedMessage = consoleSpies.log.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);
    
    expect(parsed.message).toBe('user created');
    expect(parsed['0']).toBeDefined();
    expect(parsed['0'].userId).toBe(123);
  });

  it('should produce valid JSON string', () => {
    logger.log('test');
    
    const loggedMessage = consoleSpies.log.mock.calls[0][0];
    expect(() => JSON.parse(loggedMessage)).not.toThrow();
  });
});