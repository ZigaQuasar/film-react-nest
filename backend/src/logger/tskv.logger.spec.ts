import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  
  const consoleSpies = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    debug: jest.spyOn(console, 'debug').mockImplementation(),
  };

  beforeEach(() => {
    logger = new TskvLogger();
    Object.values(consoleSpies).forEach(spy => spy.mockClear());
  });

  afterAll(() => {
    Object.values(consoleSpies).forEach(spy => spy.mockRestore());
  });

  test.each([
    ['log', 'log'],
    ['error', 'error'],
    ['warn', 'warn'],
    ['debug', 'debug'],
    ['verbose', 'log'],
  ])('should format %s message as TSKV', (method, consoleMethod) => {
    const loggerMethod = logger[method as keyof TskvLogger] as Function;
    loggerMethod.call(logger, 'test message');

    const spy = consoleSpies[consoleMethod as keyof typeof consoleSpies];
    expect(spy).toHaveBeenCalledTimes(1);
    
    const loggedMessage = spy.mock.calls[0][0];
    
    expect(loggedMessage).toContain(`level=${method}`);
    expect(loggedMessage).toContain('message=test message');
    expect(loggedMessage).toContain('time=');
    expect(loggedMessage).toMatch(/\t/);
    expect(loggedMessage).toMatch(/\n$/);
  });

  it('should escape tab and newline characters', () => {
    logger.log('message\twith\nspecial');
    
    const loggedMessage = consoleSpies.log.mock.calls[0][0];
    
    expect(loggedMessage).toContain('message=message\\twith\\nspecial');

    const messageMatch = loggedMessage.match(/message=([^\t]+)/);
    expect(messageMatch[1]).not.toContain('\t');
  });

  it('should produce valid TSKV format', () => {
    logger.log('test', 'extra1', 'extra2');
    
    const loggedMessage = consoleSpies.log.mock.calls[0][0];
    const parts = loggedMessage.trim().split('\t');
    
    parts.forEach(part => {
      expect(part).toMatch(/^[\w]+=.+$/);
    });
  });
});