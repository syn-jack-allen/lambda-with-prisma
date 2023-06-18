import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { getUsers } from '../prisma-layer/client';

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getUsers()),
  };
};
