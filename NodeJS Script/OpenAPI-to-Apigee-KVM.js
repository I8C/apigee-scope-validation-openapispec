// USAGE: node OpenAPI-to-Apigee-KVM.js <file> <proxyName> <kvmName> <baseURL> <org> <env> <accessToken>
const axios = require('axios');

// RESOURCE, VERB & SCOPE MAPPING
function mappingResources(file) {
    var yaml = require('js-yaml')
    var fs = require('fs')
    
    var obj = yaml.load(fs.readFileSync(file, {encoding: 'utf-8'}));
    
    let mapping = [];
    let entries = {};
    
    for (let path in obj.paths) {
        let map = { "resourcePath": path, "verbs": [] }
    
        for (let verb in obj.paths[path]) {
    
            let scopes = "";
            for (var secSchema in obj.paths[path][verb]["security"]) {
                scopes = Object.values(obj.paths[path][verb]["security"][secSchema])[0].join(',');
                
            }
            
            let verbMap = { "verb": verb.toUpperCase(), "scope": scopes}
            map["verbs"].push(verbMap);
        }
        mapping.push(map);
    }
    entries["entries"] = mapping;

    return JSON.stringify(entries);
}

// FUNCTION TO ADD AN ENTRY TO KVM
function addKVMEntry(scopeMapping, kvmName, proxyName, mgmtURL, accessToken) {
    axios.post(`${mgmtURL}/${kvmName}`, {
        "name": kvmName,
        "entry": [
            {
                "name": proxyName,
                "value": scopeMapping
            }
        ]
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res=> console.log(res.status))
    .catch(err=> console.log(err))
}


function run() {
    // INITIALIZE VARIABLES
    let file = process.argv[2];
    let proxyName = process.argv[3];
    let kvmName = process.argv[4];
    let baseURL = process.argv[5];
    let org = process.argv[6];
    let env = process.argv[7];
    let accessToken = process.argv[8];

    // CONVERT FILE AND CREATE SCOPE MAPPING
    let scopeMapping = mappingResources(file);

    // ADD MAPPING TO KEYVALUEMAP
    let mgmtURL = `${baseURL}/v1/organizations/${org}/environments/${env}/keyvaluemaps`
    addKVMEntry(scopeMapping, kvmName, proxyName, mgmtURL, accessToken);
}

// RUN SCRIPT
run();