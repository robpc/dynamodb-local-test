'use strict';
const AWS = require('aws-sdk');

const { IS_OFFLINE, TABLE_NAME } = process.env;

if (IS_OFFLINE) {
  AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
  });
}

const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

exports.get = event => new Promise((resolve) => {
  if (!event.pathParameters && !event.pathParameters.id) {
    resolve(createResponse(400, {code: 400, message: "missing id"}));
  }

  const { id } = event.pathParameters;

  dynamodbClient.query(
    {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id },
    },
    (err, data) => {
      if (err) {
        console.log(err);
        resolve(createResponse(500, { code: 500, message: err.message }));
        return;
      }

      if (!data || !data.Items || data.Count <= 0) {
        console.log('No data result for query', data);
        resolve(createResponse(200, { id, date: null }));
        return;
      }

      const items = data.Items;
      const result = items[items.length - 1]
      resolve(createResponse(200, result));
    },
  );
});

exports.post = event => new Promise((resolve) => {
  if (!event.pathParameters && !event.pathParameters.id) {
    resolve(createResponse(400, {code: 400, message: "missing id"}));
  }

  const { id } = event.pathParameters;

  const params = {
    Item: { id, date: new Date().toLocaleString() },
    TableName: TABLE_NAME,
  };

  dynamodbClient.put(params, (err) => {
    if (err) {
      console.log(err);
      resolve(createResponse(500, { code: 500, message: err.message }));
    } else {
      resolve(createResponse(200, params.Item));
    };
  });
});