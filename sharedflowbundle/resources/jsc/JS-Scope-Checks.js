// Initialise local variables from flow variables
var mapping = JSON.parse(context.getVariable("SF-Lib-Scope-Validation.scope-mapping"));
var resourcePath = context.getVariable("proxy.pathsuffix");
var verb = context.getVariable("request.verb");
var scopes = context.getVariable("SF-Lib-Scope-Validation.scopes").split(',');


// Select the correct resourcePath object
var currentResourcePath = "";
for(var resource in mapping["entries"]) {
    if(mapping["entries"][resource]["resourcePath"] === resourcePath) {
        currentResourcePath = mapping["entries"][resource];
    }
}


// Select the required scopes from used verb
var requiredScopes = [];
for(var verbObject in currentResourcePath["verbs"]){
    if(currentResourcePath["verbs"][verbObject]["verb"] === verb) {
        requiredScopes = currentResourcePath["verbs"][verbObject]["scope"].split(',');
    }
}

var valid = true;

// Check if there are any required scopes
if(requiredScopes.length > 0 && requiredScopes[0] != "") {
    
    // Check if request has correct scopes
    for(var reqScope in requiredScopes) {
        if(scopes.indexOf(requiredScopes[reqScope]) < 0) {
            valid = false;
            print("Required Scope not found:", requiredScopes[reqScope]);
            break;
        }
    }
}



if(valid) {
    context.setVariable("SF-Lib-Scope-Validation.valid", true);
} else {
    context.setVariable("SF-Lib-Scope-Validation.valid", false);
}

