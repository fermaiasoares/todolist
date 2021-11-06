import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uudiV4 } from 'uuid';
import dayjs from 'dayjs';

import { document } from "../../lib/dynamoDBClient";

import { IResponseAPI } from "../../lib/responseApi";

interface IRequest {
  title: string,
  done: boolean,
  deadline: Date
}

export const handle: APIGatewayProxyHandler = async (event): Promise<IResponseAPI> => {

  const { userId } = event.pathParameters;
  const { title, done, deadline } = JSON.parse(event.body) as IRequest;

  await document.put({
    TableName: 'users_todos',
    Item: {
      id: uudiV4(),
      title,
      user_id: userId,
      done,
      deadline: dayjs(deadline).format('YYYY-MM-DD HH:mm:ss'),
      created_at: new Date().getTime()
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created successfully'
    })
  }
}