import { NextFunction, Request, Response } from 'express';

const waitAsync = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export const errorHandler = (error: Error, req: Request, res: Response, _: NextFunction): void => {
  console.error(`Error calling ${req.path}`);
  console.error(error);

  waitAsync(10)
    .then(() => {
      // do nothing
      if (res.headersSent) {
        return;
      }

      res.status(500).json({
        message: 'There was a critical server error',
      });
    })
    .catch((err) => {
      console.error('We created another error while handling errors');
      console.error(err);
    });
};
