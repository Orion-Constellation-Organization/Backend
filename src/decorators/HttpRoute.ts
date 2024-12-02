import { Router, Request, Response, NextFunction } from 'express';

// Instância global do router
const router = Router();

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RouteOptions {
  path: string;
  method: HttpMethod;
  middlewares?: Array<
    (req: Request, res: Response, next: NextFunction) => void
  >;
}

/**
 * @description Decorator para definir rotas HTTP com suporte a middlewares.
 * @param options {RouteOptions} Configurações da rota (path, method, middlewares).
 */
export function HttpRoute({ path, method, middlewares = [] }: RouteOptions) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    router[method](
      path,
      ...middlewares,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await originalMethod.call(target, req, res, next);
        } catch (error) {
          next(error);
        }
      }
    );
  };
}

/**
 * @description Decorator para rotas simples sem middlewares.
 * @param options {RouteOptions} Configurações da rota (path, method).
 */
export function NoAuthRoute({
  path,
  method
}: Omit<RouteOptions, 'middlewares'>) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    router[method](
      path,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await originalMethod.call(target, req, res, next);
        } catch (error) {
          next(error);
        }
      }
    );
  };
}

/**
 * @description Função para obter a instância do router configurado.
 * @returns {Router} Router configurado com as rotas.
 */
export function getRouter(): Router {
  return router;
}
