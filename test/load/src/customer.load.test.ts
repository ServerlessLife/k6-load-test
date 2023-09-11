import { Options } from "k6/options";
import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";
import { SampleDataGenerator } from "../../sampleDataGenerator";
import {
  AWSConfig,
  SystemsManagerClient,
  // @ts-ignore
} from "https://jslib.k6.io/aws/0.9.0/ssm.js";

export const options: Options = {
  // setupTimeout: "240s",
  scenarios: {
    "per-vu-iterations": {
      executor: "shared-iterations",
      vus: 1, // how many virtual users
      maxDuration: "60000s", // how long to execute the script in a loop
      iterations: 1, // for all workers (if it does not hit maxDuration)
    },
  },
};

/**
 * login user and get access token
 */
export async function setup() {
  // ********* Alternative way to read secrets from SSM Parameter Store using k6-jslib-aws ********
  // const awsConfig = new AWSConfig({
  //   region: __ENV.AWS_REGION,
  //   accessKeyId: __ENV.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: __ENV.AWS_SECRET_ACCESS_KEY,
  //   sessionToken: __ENV.AWS_SESSION_TOKEN,
  // });

  // const secretsManager = new SystemsManagerClient(awsConfig);
  // const secretName = `/sst/${__ENV.SST_APP}/${__ENV.SST_STAGE}/Parameter/COGNITO_USER_POOL_ID/value`;

  // const userPoolIdFromSSM = await secretsManager.getParameter(secretName);
  // console.log("userPoolIdFromSSM", userPoolIdFromSSM.value);
  // ****************************************************************************************

  const username = "guest";
  const password = "paSSword1!";
  const userPoolId = __ENV.SST_Parameter_value_COGNITO_USER_POOL_ID;
  const clientId = __ENV.SST_Parameter_value_COGNITO_USER_POOL_CLIENT_ID;
  const region = __ENV.AWS_REGION;

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

  const res = http.post(
    `https://${hostname}/${userPoolId}`,
    JSON.stringify(postData),
    {
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    }
  );

  const body = JSON.parse(res.body as string);

  const accessToken = body.AuthenticationResult.AccessToken;

  return {
    accessToken,
  };
}

export default async function ({ accessToken }: { accessToken: string }) {
  const url = __ENV.SST_Parameter_value_API_URL;

  const customer = SampleDataGenerator.generateCustomer();

  const res = http.post(url, JSON.stringify(customer), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  check(res, {
    "status is 200": () => res.status === 200,
  });

  // sleep for 1 second
  sleep(1);
}
