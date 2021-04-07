import express, { NextFunction, Request, Response } from 'express';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import makeLogger from './logger';

const logger = makeLogger(module);

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export const CONTACTS_TABLE_NAME = 'OncallContacts';

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

export const getContacts = (_: Request, res: Response, next: NextFunction): void => {
  logger.info('Getting all contacts');
  const processAsync = async (): Promise<Contact[]> => {
    const contacts: Contact[] = [];
    let evalKey: AWS.DynamoDB.Key | undefined = undefined;
    do {
      const contactResponse = await dynamo.scan({
        TableName: CONTACTS_TABLE_NAME,
        ExclusiveStartKey: evalKey,
      }).promise() as AWS.DynamoDB.ScanOutput;
      evalKey = contactResponse.LastEvaluatedKey;
      
      contactResponse
        .Items
        ?.map((item) => ddbConverter.unmarshall(item))
        .forEach((contact) => contacts.push(contact as Contact));

    } while (evalKey);

    logger.info('Returned %d contacts', contacts.length);
    return contacts;
  };

  processAsync()
    .then((contacts) => {
      res.json({
        contacts,
      });
      logger.info('Returned contacts');
    })
    .catch(next);
};

export const createContact = (req: Request, res: Response, next: NextFunction): void => {
  logger.info('Creating a contact');
  const processAsync = async (contact: Contact): Promise<void> => {
    const dynamoItem = ddbConverter.marshall(contact);
    const ddbRes = await dynamo.putItem({
      Item: dynamoItem,
      TableName: CONTACTS_TABLE_NAME,
      ReturnValues: 'NONE',
    }).promise() as AWS.DynamoDB.PutItemOutput;
    logger.info('Created contact with id %s', contact.id);
    res.json(contact);
  };

  const maybeErrors = validateContact(req.body as Partial<Contact>);
  if (maybeErrors.length) {
    logger.warn('There were validation errors; %s', maybeErrors.join(', '));
    res.status(400).json({
      errors: maybeErrors,
    });
    return;
  }

  const contact = req.body as Contact;
  contact.id = uuid();

  processAsync(contact)
    .catch(next);
};

export const updateContact = (req: Request, res: Response, next: NextFunction): void => {
  logger.info('Updating contact %s', req.params.id);
  const processAsync = async (contact: Contact) => {
    await dynamo.updateItem({
      Key: {
        'id': {
          S: contact.id,
        }
      },
      TableName: CONTACTS_TABLE_NAME,
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
    logger.info('Contact successfully updated');
    res.sendStatus(204);
  };

  const contact = req.body as Contact;
  const maybeErrors = validateContact(req.body as Partial<Contact>);
  if (!req.params.id) {
    maybeErrors.push('A contact must have an id');
  }
  if (maybeErrors.length) {
    logger.warn('There were validation errors: %s', maybeErrors.join(', '));
    res.status(400).json({
      errors: maybeErrors,
    });
    return;
  }
  contact.id = req.params.id;

  processAsync(contact)
    .catch(next);
};

export const deleteContact = (req: Request, res: Response, next: NextFunction): void => {
  logger.info('Deleting contact with id %s', req.params.id);
  const processAsync = async () => {
    await dynamo.deleteItem({
      Key: {
        'id': {
          S: req.params.id,
        }
      },
      TableName: CONTACTS_TABLE_NAME,
      ReturnValues: 'NONE',
    }).promise();
    logger.info('Contact deleted');
    res.sendStatus(204);
  };

  processAsync()
    .catch(next);
};

// TODO: We should separate the controller functions from express
const router = express.Router();
router.get('/', getContacts);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
export default router;
