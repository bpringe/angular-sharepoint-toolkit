# Angular SharePoint Toolkit
An AngularJS module that simplifies common tasks when writing Angular apps for SharePoint, such as getting user profile properties and getting an always-current request digest value for use in post and put requests. At this time, the module contains these two components than can be injected into your components:
- **userProfileService**
- **requestDigestService**

I'm open to any suggestions for changes or additions to this module!

##Installation
Download the `angular-sharepoint-toolkit.js` file and reference it with a script tag after the angular reference in your html file. Then reference the module in your app module definition.
```javascript
var app = angular.module('spUserProfileServiceExample', ['sharePointToolkit']);
```
The following steps in this guide assume the above steps are completed. Below, you will find a reference for how to use the components in this module.

## userProfileService
A service that makes getting SharePoint user profile properties easier. The Angular service calls the SharePoint rest API to get the current user's properties and returns an object with the properties as functions of the object. The service only performs a lookup in the array of key value pairs returned from the API when the user property desired is referenced as a function on the object.
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
### Usage
See app.js for an example. Remember, this code must run from within a SharePoint site since it calls the SharePoint API.

1.. Inject the userProfileService into your controller/service/factory
```javascript
exampleController.$inject = ['userProfileService'];
function exampleController(userProfileService) { ... }
```
2.. Call the getUserProfile() async method of the userProfileService
```javascript
userProfileService.getUserProfile()
    .then(success, error);
```
3.. Access the properties of the response object by calling the properties as functions
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

### Configuration
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
#### Changing the URL
If you want to modify the URL that the request for properties uses, set the `url` property of the `spUserProfileConfig` object.
```javascript
var app = angular.module('yourModule', ['spUserProfile'])
   .config(['spUserProfileConfig', function(spUserProfileConfig) {
            spUserProfileConfig.url = 'http://someotherdomain.com/_api/SP.UserProfiles.PeopleManager/GetMyProperties';
   }]);
```
## requestDigestService
A service that makes working with post and put requests easier by making sure the request digest value is always fresh (has not timed out since the user last reloaded the page). The default timeout period for the digest value is 30 minutes. Once the digest value has expired, any requests made with it will return a 403 Forbidden error. This service will get a new request digest value in the background each time the value is about to expire. All you have to do is inject the service and use `requestDigestService.requestDigest` for the value of your 'X-RequestDigest' header.

### Usage
1.. Inject the `requestDigestFactory` into your controller/service/factory
```javascript
exampleController.$inject = ['requestDigestFactory'];
function exampleController(requestDigestFactory) { ... }
```
2.. In your http request, set the 'X-RequestDigest' header value using the service property
```javascript
$http({
   method: 'POST',
   url: 'http://someDomain',
   headers: {
      'Content-Type': 'application/json;odata=verbose',
      'Accept': 'application/json;odata=verbose',
      'X-RequestDigest': requestDigestService.requestDigest
   },
   data: yourData
});
```

