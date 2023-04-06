# Create Scope Mapping using OpenAPI Specification

## What does this script do?

This script first of all converts the given OpenAPI Specification from Yaml to JSON format, after the convertion it will create a nice "scope-mapping" object that can be used in side of the Apigee SharedFlow. Because we need to be able to access this "scope-mapping" object, we will need to upload it to an Apigee KeyValueMap using the [Apigee Management API](https://apidocs.apigee.com/docs/key-value-maps/1/overview).

## How to use the script?

1. Navigate to the correct folder

        cd "./NodeJS Script"

2. Install the required NodeJS Modules

        npm install

3. Run the script!

        node OpenAPI-to-Apigee-KVM.js <file> <proxyName> <kvmName> <baseMgmtURL> <org> <env> <accessToken>