import { APIGatewayProxyHandler } from 'aws-lambda';

import { IResponseAPI } from '../../lib/responseApi';
import { document } from '../../lib/dynamoDBClient';

export const handle: APIGatewayProxyHandler = async (event): Promise<IResponseAPI> => {
  const { userId } = event.pathParameters;

  const todos = await document.scan({
    TableName: 'users_todos',
    FilterExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos: todos.Items,
      total: todos.Count
    }),
  };
}