export * as SampleDataGenerator from "./sampleDataGenerator";
import { faker } from "@faker-js/faker";
import { Customer } from "@k6-load-test/core/types/customer";

export function generateCustomer(): Customer {
  return {
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    email: faker.internet.email(),
  };
}
