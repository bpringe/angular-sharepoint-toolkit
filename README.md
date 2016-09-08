# angular-spuserprofile
A simple Angular module for getting SharePoint User Profile properties. The Angular service calls the SharePoint rest API to get the current user's properties by default and returns an object with the user properties set as functions of the object. The service only performs a lookup in the array of key value pairs returned from the API when the property desired is referenced as a function on the object.
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
See app.js for an example. Remember this code must run from within a SharePoint site, since it calls the SharePoint API.

1.. Reference the module in your app module definition
```javascript
var app = angular.module('spUserProfileExample', ['spUserProfile']);
```
2.. Inject the userProfileService into your controller/service/factory
```javascript
exampleController.$inject = ['userProfileService'];
```
3.. Call the getUserProfile() async method of the userProfileService
```javascript
userProfileService.getUserProfile()
    .then(success, error);
```
4.. Access the properties of the response object by calling the properties as functions
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
### Getting Other Properties
You can add more properties to be returned from the userProfileService. Here are the properties returned by default.
```javascript
            'SPS-DistinguishedName',
            'SID',
            'Manager',
            'PreferredName',
            'FirstName',
            'LastName',
            'SPS-PhoneticDisplayName',
            'SPS-PhoneticFirstName',
            'SPS-PhoneticLastName',
            'WorkPhone',
            'WorkEmail',
            'Office',
            'SPS-JobTitle',
            'Department',
            'UserName',
            'PublicSiteRedirect',
            'SPS-ProxyAddresses',
            'SPS-SourceObjectDN',
            'SPS-ClaimID',
            'SPS-ClaimProviderID',
            'SPS-ClaimProviderType'
```
To add more properties or to modify the existing properties, override the `spUserProfileConfig` object to add/change/remove properties from the `properties` array.
```javascript
var app = angular.module('yourModule', ['spUserProfile'])
   .config(['spUserProfileConfig', function(spUserProfileConfig) {
            spUserProfileConfig.properties.push('yourCustomProperty');
            spUserProfileConfig.properties.push('yourOtherCustomProperty');
            // etc... just remember properties is an array of strings
   }]);
```
