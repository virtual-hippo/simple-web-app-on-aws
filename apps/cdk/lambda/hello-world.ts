import { APIGatewayEvent, ProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<ProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello World",
    }),
  };
};
