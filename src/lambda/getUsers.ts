import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { getUsers } from '/opt/client';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log(event);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await getUsers()),
  };
};
