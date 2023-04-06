 // Initialise local variables from flow variables
var mapping = JSON.parse(context.getVariable("Scope-Validation-OpenAPISpec.scope_mapping"));
var resourcePath = context.getVariable("proxy.pathsuffix");
var verb = context.getVariable("request.verb");
var TokenScopes = context.getVariable("Scope-Validation-OpenAPISpec.token_scopes");

var validScopes = false;

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

// REMOVE DUPLICATE SCOPES OF REQUIRED SCOPES LIST
var ScopesRequiredList = [];
for (var i in requiredScopes) {
    var noRepeat = true;
    for (var j in ScopesRequiredList) {
      if (ScopesRequiredList.indexOf(requiredScopes[i]) >= 0) {
        noRepeat = false;
        break;
      }
    }

    if (noRepeat) {
      ScopesRequiredList.push(requiredScopes[i]);
    }
}

// Check if there are any required scopes filled in, in the JSON object
if(ScopesRequiredList.length > 0 && ScopesRequiredList[0] !== "") {
    var TokenScopesList = TokenScopes.split(" ");
    
    // Counter for matching Scopes
    var matches = 0;
    
    // Loop over every scope that has to be matched and check if exists in TokenScopesList
    for(var ScopeToMatch in ScopesRequiredList) {
        if (TokenScopesList.indexOf(ScopesRequiredList[ScopeToMatch]) >= 0) {
            matches +=1;
        }
    }
    
    // Check if matches is same number as the length of ScopesRequiredList
    if (ScopesRequiredList.length === matches) {
        validScopes = true;
    } else {
         validScopes = false;
    }
    
    // THERE ARE NOT REQUIRED SCOPES FILLED IN
} else {
    validScopes = true;
}
   
// Set ValidScopes true if scope check is successful
if(validScopes) {
    context.setVariable("Scope-Validation-OpenAPISpec.valid_scopes", true);
} else {
    context.setVariable("Scope-Validation-OpenAPISpec.valid_scopes", false);
}