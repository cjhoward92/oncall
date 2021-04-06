import mockAws, { configReceiver, dynamoInternals, promiseResponse } from './../__mocks__/aws-sdk';
import { getContacts, CONTACTS_TABLE_NAME } from './../src/contacts';

// Since our express functions are calling promises but the return
// signature isn't a promise we need to force the event loop
// to process some promises.
const flushPromiseQueue: () => Promise<void> = () => new Promise((resolve) => {
  setTimeout(resolve, 1);
});

describe('contacts', () => {
  let mockRes: any;
  let mockReq: any;
  let mockNext: any;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
    };
    mockReq = {};
    mockNext = jest.fn();
  });

  describe('getContacts', () => {
    it('should return contacts', async () => {
      promiseResponse.mockResolvedValueOnce({
        LastEvaluatedKey: undefined,
        Items: [{ test: 1 }] as any,
      });
      mockAws.DynamoDB.Converter.unmarshall = jest.fn((x) => x);
  
      getContacts(mockReq, mockRes, mockNext);
      await flushPromiseQueue();
  
      expect(dynamoInternals.scan).toHaveBeenCalledWith({
        TableName: CONTACTS_TABLE_NAME,
        ExclusiveStartKey: undefined,
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        contacts: [{ test: 1 }]
      });
    });
  });
});