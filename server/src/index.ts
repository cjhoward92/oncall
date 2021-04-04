import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import contactsRouter from './contacts';
import { errorHandler } from './error';

const app = express();

app.use(express.json());
// TODO: add CORS

app.use('/contacts', contactsRouter);

app.get('/', (_, res) => {
  res.json({ message: 'hello' });
});
app.use(errorHandler);

const runLocal = process.env.RUN_LOCAL || false;

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
