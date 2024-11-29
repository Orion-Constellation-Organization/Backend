import { Request, Response } from 'express';
import { HttpRoute } from '../decorators/HttpRoute';

export class HomeController {
  @HttpRoute({ path: '/', method: 'get' })
  hello(req: Request, res: Response) {
    res.send('Welcome to the API!');
  }
}
