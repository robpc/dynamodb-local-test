const AWS = require('aws-sdk');
const Logger = require('./logger');

// const logger = new Logger('DynamoDB');

const { IS_OFFLINE } = process.env;

if (IS_OFFLINE) {
  AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
  });
}

const dynamodb = new AWS.DynamoDB();
const dynamodbClient = new AWS.DynamoDB.DocumentClient();

const query = params => new Promise((resolve, reject) => {
  let result = [];
  let last = null;
  const queryCallback = (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    if (!data) {
      reject(new Error('No data result for query'));
      return;
    }

    if (data.Items && data.Count > 0) {
      result = result.concat(data.Items);
    }

    if (data.LastEvaluatedKey) {
      last = data.LastEvaluatedKey;
    } else {
      // logger.info('query | result', result);
      resolve(result);
      last = null;
    }
  };

  // logger.info('query | params:', params);
  do {
    const opts = last ? Object.assign(params, { ExclusiveStartKey: last }) : params;
    dynamodbClient.query(opts, queryCallback);
  } while (last);
});

const save = (tableName, item) => new Promise(
  (resolve, reject) => {
    const params = {
      Item: item,
      TableName: tableName,
    };

    // logger.info('saving', params);

    dynamodbClient.put(params, (err) => {
      if (err) reject(err);
      else resolve(item);
    });
  },
);


module.exports = {
  dynamodb,
  dynamodbClient,

  query,
  save,
};
