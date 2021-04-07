import express from 'express';
import cors from 'cors';
import { createServer, proxy } from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import contactsRouter from './contacts';
import { errorHandler } from './error';

const runLocal = process.env.RUN_LOCAL || false;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRouter);

app.get('/', (_, res) => {
  res.json({ message: 'hello' });
});
app.use(errorHandler);

if (runLocal) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Listening on port', port);
  });
}

const server = createServer(app);
export const handler = (event: APIGatewayProxyEvent, context: Context): void => {
  proxy(server, event, context);
};
