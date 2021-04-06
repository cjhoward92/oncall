export const promiseResponse = jest.fn().mockResolvedValue(undefined);

const putFn = jest.fn().mockImplementation(() => ({ promise: promiseResponse }));
const getFn = jest.fn().mockImplementation(() => ({ promise: promiseResponse }));
const deleteFn = jest.fn().mockImplementation(() => ({ promise: promiseResponse }));
const updateFn = jest.fn().mockImplementation(() => ({ promise: promiseResponse }));
const scanFn = jest.fn().mockImplementation(() => ({ promise: promiseResponse }));

export const dynamoInternals = {
  putItem: putFn,
  scan: scanFn,
  getItem: getFn,
  updateItem: updateFn,
  deleteItem: deleteFn,
};

export const configReceiver = jest.fn();

const DynamoDBMock = function(config: { region: string }): any {
  configReceiver(config);
  return dynamoInternals;
};

DynamoDBMock.Converter = {
  marshall: jest.fn(),
  unmarshall: jest.fn(),
};

export default {
  DynamoDB: DynamoDBMock,
};