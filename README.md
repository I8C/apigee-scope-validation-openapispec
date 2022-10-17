# OpenAPI Spec scope validation

## What is the goal of this repository?

The goal of this project in validation the scopes available in the JWT token returned after introspection the opaque access token against the the required scopes defined in the provided OpenAPI Specification.

## Working external mechanism

When uploading a new OpenAPI Specification, through some sort of CI/CD this NodeJS script (later maybe Lambda function) will have to be executed, this script will then read the YAML file and convert it to a JSON format for easier operation.

Once this OpenAPI Specification is converted to JSON then the mapping of resources and scopes will be done as well as requesting an access token for a machine user that has permission to invoke Apigee's management API. Then this management API is used to add a new entry in the KeyValueMap used (buildtime-scope-mapping) with the key being the name of the belonging proxy.

![Buildtime](./images/buildtime.png)

### How to use this script?

1. Install required node modules:

<code>npm install</code>

2. Create <b>.env</b> file with the following content:

        # Machine User Credentials
        M_USER=<user>
        M_PASS=<password>

        # Credentials for management API (Do not change)
        BA_USER=<user>
        BA_PASS=<password>

        # Endpoints
        TOKEN_ENDPOINT=<access token endpoint (full URL)>
        APIGEE_MGM_API=<apigee management api hostname>/v1/organizations/<organization>/environments/<environment>/keyvaluemaps/<name of kvm>

3. Run the script from the command line:

```node mappingResources.js <filename>.yml <name apigee proxy>```

## Working within Apigee

After the scope mapping is added to the KeyValueMap by the external script, a Shared Flow must be addressed within Apigee namely <b>SF-Lib-Scope-Validation</b> <i>(See [sharedflowbundle](./sharedflowbundle/))</i>. This shared flow is made as dynamic as possible so that it can later be used as a separate building block. This shared flow has a single input parameter namely, the scopes returned in the JWT after introspection.

In this shared flow some policies are used for reading the scope mapping from the KeyValueMap, as well as a JavaScript policy for checking whether the request contains the required scopes.