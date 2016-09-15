(function() {
    var app = angular.module('sharePointToolkit', []);

    app.constant('userProfileServiceConfig', {
        userProperties: [
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
        ],
        url: _spPageContextInfo.siteAbsoluteUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties'
    });
    
    app.constant('requestDigestServiceConfig', {
        siteUrl: _spPageContextInfo.siteAbsoluteUrl
    });

    app.service('userProfileService', userProfileService);
    userProfileService.$inject = ['$http', '$q', 'UserProfileFactory', 'userProfileServiceConfig'];
    function userProfileService($http, $q, UserProfileFactory, userProfileServiceConfig) {
        var self = this;
        self.getUserProfile = getUserProfile;

        function getUserProfile() {
            var deferred = $q.defer();

            var request = 
                    $http({
                          method: 'GET',
                          url: userProfileServiceConfig.url,
                          cache: true,
                          headers: {
                              Accept: 'application/json;odata=verbose'
                          }
                    });

            request.then(function(response) {
                deferred.resolve(
                    UserProfileFactory.create(
                        response.data.d.UserProfileProperties.results));
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

    app.factory('UserProfileFactory', UserProfileFactory);
    UserProfileFactory.$inject = ['userProfileServiceConfig'];
    function UserProfileFactory(userProfileServiceConfig) {

        function UserProfile(userProperties) {
            var properties = userProperties,
                configProperties = userProfileServiceConfig.userProperties,
                self = this;

            for (var k = 0; k < configProperties.length; k++) {
                var propNameNoHyphen = configProperties[k].replace('-', '');
                self[propNameNoHyphen] = getValue(configProperties[k]);
            }

            function getValue(key) {
                return function() {
                    for (var i = 0; i < properties.length; i++) {
                        if (properties[i].Key === key) {
                            return properties[i].Value;
                        }
                    }
                    return '';
                }
            }
        }

        function create(userProperties) {
            return new UserProfile(userProperties);
        }

        return {
            create: create
        }
    }

    app.service('requestDigestService', requestDigestService);
    requestDigestService.$inject = ['$http', 'requestDigestServiceConfig', '$timeout'];
    function requestDigestService($http, requestDigestServiceConfig, $timeout) {
        var self = this,
            requestDigestTimeout;
        self.requestDigest = '';

        getRequestDigest();

        function getRequestDigest() {
            $http.post(requestDigestServiceConfig.siteUrl + '/_api/contextinfo', {}, {
                headers: {
                    'Accept': 'application/json;odata=verbose',
                    'Content-Type': 'application/json;odata=verbose'
                }
            }).then(function (response) {
                self.requestDigest = response.data.d.GetContextWebInformation.FormDigestValue;
                requestDigestTimeout = response.data.d.GetContextWebInformation.FormDigestTimeoutSeconds - 10;
                //console.log("Refreshing request digest -- requestDigestTimeout - " + requestDigestTimeout + ' seconds');
                $timeout(getRequestDigest, requestDigestTimeout * 1000);
            }, function(error) {
                console.log('Error getting request digest: ' + error);
            });
        }
    }
})();