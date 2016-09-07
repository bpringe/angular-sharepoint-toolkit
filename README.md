# angular-spuserprofile
A simple Angular module for getting SharePoint User Profile properties. The Angular service will call the SP rest API to get the current user's properties by default and return an object with the user properties set as functions of the object. The service only performs a lookup in the array of key value pairs returned from the API when the property desired is referenced as a function on the object.

```javascript
userProfileService.getUserProfile()
            .then(function(response) {
                // Note: properties that contain a hyphen in SP will be the same name without the hyphen
                vm.userProfile.jobTitle = response.SPSJobTitle();
                vm.userProfile.firstName = response.FirstName();
            }, function(error) {
                console.log(error);
            });
```

## Instructions
See app.js for an example. Remember this code must be running from within a SharePoint site, since it calls the SharePoint API.

1. Reference the module in your app module definition
```javascript
var app = angular.module('spUserProfileExample', ['spUserProfile']);
```
2. Inject the userProfileService into your controller/service/factory
```javascript
exampleController.$inject = ['userProfileService'];
```
3. Call the getUserProfile() async method of the userProfileService
```javascript
 userProfileService.getUserProfile()
            .then(success, error);
```
4. Access the properties of the response object by calling the properties as functions
```javascript
function success(response) {
            var firstName = response.FirstName();
}
```
**Note: The user properties whose key contains a hyphen will be stripped of the hyphen when the property is created on the object. Reference these function properties by the same name without the hyphen.**
```javascript
            // the property returned is called SPS-JobTitle
            var title = response.SPSJobTitle();
```

