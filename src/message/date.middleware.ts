import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class DateParserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Vérifiez si req.body existe avant de tenter de le déstructurer
    if (req.body && req.body.scheduledDate && typeof req.body.scheduledDate === 'string') {
      const parsedDate = new Date(req.body.scheduledDate);

      // Vérifier si la date est valide
      if (!isNaN(parsedDate.getTime())) {
        req.body.scheduledDate = parsedDate;
      } else {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    next();
  }
}
