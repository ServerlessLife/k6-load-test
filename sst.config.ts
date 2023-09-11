import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "k6-load-test",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      tracing: "disabled",
      logRetention: "two_weeks",
      runtime: "nodejs18.x",
    });
    app.stack(API);
  },
} satisfies SSTConfig;
