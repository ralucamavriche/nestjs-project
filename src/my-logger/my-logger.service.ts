import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string) {
    const formattedEntry = `${Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', 'logs.txt'),
        formattedEntry,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log('Failed to write log to file', error.message);
      }
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    void this.logToFile(entry);
    super.log(message, context);
  }

  error(message: any, stackContext?: string) {
    const entry = `${stackContext}\t${message}`;
    void this.logToFile(entry);
    super.error(message, stackContext);
  }
}
