(function() {
    var app = angular.module('spUserProfile', []);

    app.constant('spUserProfileConfig', {
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

    ////////////////////////////// userProfileService
    app.service('userProfileService', userProfileService);
    userProfileService.$inject = ['$http', '$q', 'UserProfileFactory', 'spUserProfileConfig'];
    function userProfileService($http, $q, UserProfileFactory, spUserProfileConfig) {
        var self = this;
        self.getUserProfile = getUserProfile;

        function getUserProfile() {
            var deferred = $q.defer();

            var request = 
                    $http({
                          method: 'GET',
                          url: spUserProfileConfig.url,
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

    ////////////////////////////// UserProfileFactory
    app.factory('UserProfileFactory', UserProfileFactory);
    UserProfileFactory.$inject = ['spUserProfileConfig'];
    function UserProfileFactory(spUserProfileConfig) {

        function UserProfile(userProperties) {
            var properties = userProperties,
                configProperties = spUserProfileConfig.userProperties,
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
})();