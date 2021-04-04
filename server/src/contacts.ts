import express, { NextFunction, Request, Response } from 'express';
import AWS, { DynamoDBStreams } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

const TABLE_NAME = 'OncallContacts';

const ddbConverter = AWS.DynamoDB.Converter;
const dynamo = new AWS.DynamoDB({
  region: process.env.AWS_REGION || 'us-west-2',
});

const validateContact = (maybeContact: Partial<Contact>): string[] => {
  const errors: string[] = [];

  if (!maybeContact.name) {
    errors.push('A contact requires a name');
  }
  if (!maybeContact.phoneNumber) {
    errors.push('A contact requires a phone number');
  }

  return errors;
};

const router = express.Router();

router.get('/', (_: Request, res: Response, next: NextFunction): void => {
  const processAsync = async (): Promise<Contact[]> => {
    const contacts: Contact[] = [];
    let evalKey: AWS.DynamoDB.Key | undefined = undefined;
    do {
      const contactResponse = await dynamo.scan({
        TableName: TABLE_NAME,
        ExclusiveStartKey: evalKey,
      }).promise() as AWS.DynamoDB.ScanOutput;
      evalKey = contactResponse.LastEvaluatedKey;
      
      contactResponse
        .Items
        ?.map((item) => ddbConverter.unmarshall(item))
        .forEach((contact) => contacts.push(contact as Contact));

    } while (evalKey);

    return contacts;
  };

  processAsync()
    .then((contacts) => {
      res.json({
        contacts,
      });
    })
    .catch(next);
});

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const processAsync = async (contact: Contact): Promise<void> => {
    const dynamoItem = ddbConverter.marshall(contact);
    const ddbRes = await dynamo.putItem({
      Item: dynamoItem,
      TableName: TABLE_NAME,
      ReturnValues: 'NONE',
    }).promise() as AWS.DynamoDB.PutItemOutput;
    res.json(contact);
  };

  const maybeErrors = validateContact(req.body as Partial<Contact>);
  if (maybeErrors.length) {
    res.status(400).json({
      errors: maybeErrors,
    });
    return;
  }

  const contact = req.body as Contact;
  contact.id = uuid();

  processAsync(contact)
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  const processAsync = async (contact: Contact) => {
    await dynamo.updateItem({
      Key: {
        'id': {
          S: contact.id,
        }
      },
      TableName: TABLE_NAME,
      ReturnValues: 'NONE',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#p': 'phoneNumber',
      },
      ExpressionAttributeValues: {
        ':n': {
          S: contact.name,
        },
        ':p': {
          S: contact.phoneNumber,
        },
      },
      UpdateExpression: 'SET #n = :n, #p = :p',
    }).promise();
    res.sendStatus(204);
  };

  const contact = req.body as Contact;
  const maybeErrors = validateContact(req.body as Partial<Contact>);
  if (!req.params.id) {
    maybeErrors.push('A contact must have an id');
  }
  if (maybeErrors.length) {
    res.status(400).json({
      errors: maybeErrors,
    });
    return;
  }
  contact.id = req.params.id;

  processAsync(contact)
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const processAsync = async () => {
    await dynamo.deleteItem({
      Key: {
        'id': {
          S: req.params.id,
        }
      },
      TableName: TABLE_NAME,
      ReturnValues: 'NONE',
    }).promise();
    res.sendStatus(204);
  };

  processAsync()
    .catch(next);
});

export default router;
