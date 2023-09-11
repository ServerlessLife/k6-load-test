import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const customer = JSON.parse(_evt.body!);

  console.log("Customer created", customer);

  return {
    statusCode: 200,
    body: JSON.stringify(customer),
  };
});
