import express, { Request, Response } from 'express';
import AWS from 'aws-sdk';

const TABLE_NAME = 'OncallContacts';

const ddbConverter = AWS.DynamoDB.Converter;
const dynamo = new AWS.DynamoDB();

const router = express.Router();

router.get('/', async (_: Request, res: Response): void => {

  const contacts = [];
  let evalKey: AWS.DynamoDB.Key = undefined;
  do {
    const contactResponse = await dynamo.scan({
      TableName: TABLE_NAME,
      ExclusiveStartKey: evalKey,
    }).promise();
    evalKey = contactResponse.LastEvaluatedKey;
    
    contactResponse
      .Items
      ?.map((item) => ddbConverter.unmarshall(item))
      .forEach((contact) => contacts.push(contact));

  } while (evalKey);

  res.json({
    contacts,
  });
});

export default router;
