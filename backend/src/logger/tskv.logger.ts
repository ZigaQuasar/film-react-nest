import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const parts = [
      `time=${timestamp}`,
      `level=${level}`,
      `message=${this.escapeValue(String(message))}`
    ];
    
    optionalParams.forEach((param, index) => {
      parts.push(`param${index}=${this.escapeValue(String(param))}`);
    });
    
    return parts.join('\t') + '\n';
  }

  private escapeValue(value: string): string {
    return value.replace(/\t/g, '\\t').replace(/\n/g, '\\n');
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}