'use strict';
const { query, save } = require('./db');
const Logger = require('./logger');

const logger = new Logger('index');

const { TABLE_NAME } = process.env;

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

exports.get = async (event) => {
  // logger.info("request: " + JSON.stringify(event, null, 2));

  if (!event.pathParameters && !event.pathParameters.id) {
    return createResponse(400, {code: 400, message: "missing id"})
  }

  const { id } = event.pathParameters;

  const response = await query({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id },
  })
  .then((items) => {
    if (items && items.length > 0) {
      const result = items[items.length - 1];
      return createResponse(200, result);
    } else {
      return createResponse(200, { id, date: null });
    }
  })
  .catch((err) => {
    logger.error(err);
    return createResponse(500, { code: 500, message: err.message });
  });

  // logger.info("response: " + JSON.stringify(response))
  return response;
};

exports.post = async (event) => {
  // logger.info("request: " + JSON.stringify(event, null, 2));

  if (!event.pathParameters && !event.pathParameters.id) {
    return createResponse(400, {code: 400, message: "missing id"})
  }

  const { id } = event.pathParameters;

  const response = await save(TABLE_NAME, { id, date: new Date().toLocaleString() })
    .then(item => createResponse(200, item))
    .catch((err) => {
      logger.error(err);
      return createResponse(500, { code: 500, message: err.message });
    });

  // logger.info("response: " + JSON.stringify(response))
  return response;
};