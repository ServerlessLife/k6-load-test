import { beforeAll, describe, expect, test } from "vitest";
import { SampleDataGenerator } from "../sampleDataGenerator";
import { Config } from "sst/node/config";

describe("customer endpoint", () => {
  let accessToken: string;

  beforeAll(async () => {
    const username = "guest";
    const password = "paSSword1!";

    const userPoolId = Config.COGNITO_USER_POOL_ID;
    const clientId = Config.COGNITO_USER_POOL_CLIENT_ID;
    const region = "eu-west-1";

    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId,
    };

    const postData = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: poolData.ClientId,
      UserPoolId: poolData.UserPoolId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const hostname = `cognito-idp.${region}.amazonaws.com`;

    const response = await fetch(`https://${hostname}/${userPoolId}`, {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    });

    const responseData = await response.json();

    accessToken = responseData.AuthenticationResult.AccessToken;
  });

  test("customer endpoint", async () => {
    const customer = SampleDataGenerator.generateCustomer();

    const response = await fetch(Config.API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });

    const responseData = await response.json();

    expect(response.status).toEqual(200);
    expect(responseData).toEqual(customer);
  });
});
