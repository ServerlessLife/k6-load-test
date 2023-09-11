import { StackContext, Api, Config } from "sst/constructs";
import { Cognito } from "sst/constructs";

export function API({ stack }: StackContext) {
  const cognito = new Cognito(stack, "Auth", {
    cdk: {
      userPoolClient: {
        authFlows: {
          userPassword: true,
        },
      },
    },
  });

  const api = new Api(stack, "api", {
    routes: {
      "POST /": "packages/functions/src/createCustomer.handler",
    },
    defaults: {
      authorizer: "myAuthorizer",
    },
    authorizers: {
      myAuthorizer: {
        type: "user_pool",
        userPool: {
          id: cognito.userPoolId,
          clientIds: [cognito.userPoolClientId],
        },
      },
    },
  });

  new Config.Parameter(stack, "API_URL", {
    value: api.url,
  });

  new Config.Parameter(stack, "COGNITO_USER_POOL_ID", {
    value: cognito.userPoolId,
  });

  new Config.Parameter(stack, "COGNITO_USER_POOL_CLIENT_ID", {
    value: cognito.userPoolClientId,
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
