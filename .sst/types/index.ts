import "sst/node/config";
declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}import "sst/node/api";
declare module "sst/node/api" {
  export interface ApiResources {
    "api": {
      url: string;
    }
  }
}import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "API_URL": {
      value: string;
    }
  }
}import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "COGNITO_USER_POOL_ID": {
      value: string;
    }
  }
}import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "COGNITO_USER_POOL_CLIENT_ID": {
      value: string;
    }
  }
}