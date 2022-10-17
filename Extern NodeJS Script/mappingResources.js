// USAGE: node mappingResources.js <file> <proxyName>
const axios = require('axios');

// RESOURCE, VERB & SCOPE MAPPING
function mappingResources() {
    var yaml = require('js-yaml')
    var fs = require('fs')
    
    var obj = yaml.load(fs.readFileSync(process.argv[2], {encoding: 'utf-8'}));
    
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


// REQUEST ACCESS TOKEN AND POPULATE APIGEE KVM
function requestAccessAndPopulate() {
    
    require('dotenv').config()

    axios.post(process.env.TOKEN_ENDPOINT, {
        'grant_type': 'password',
        'username': process.env.M_USER,
        'password': process.env.M_PASS
    }, {
        auth: {
          username: process.env.BA_USER,
          password: process.env.BA_PASS
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res=> {
        let ACCESS_TOKEN = res.data["access_token"];
        let mapping = mappingResources();
        addKVMEntry(ACCESS_TOKEN, mapping);
      })
      .catch(err=> console.log(err))
    
}

function addKVMEntry(ACCESS_TOKEN, mapping) {
    axios.post(process.env.APIGEE_MGM_API, {
        "name": "buildtime-scope-mapping",
        "entry": [
            {
                "name": process.argv[3],
                "value": mapping
            }
        ]
    }, {
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    }).then(res=> console.log(res.status))
    .catch(err=> console.log(err))
}


// RUN SCRIPT
requestAccessAndPopulate()

