import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const app = express();

app.use(express.json());
// TODO: add CORS

app.get('/', (req, res) => {
  console.log('Received request to', req.path);
  res.json({ message: 'hello' });
});

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
