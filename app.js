(function() {
    var app = angular.module('spUserProfileExample', ['spUserProfile']);

    app.controller('exampleController', exampleController);
    exampleController.$inject = ['userProfileService'];
    function exampleController(userProfileService) {
        var vm = this;
        vm.userProfile = {};

        userProfileService.getUserProfile()
            .then(function(response) {
                // Note: properties that contain a hyphen in SP will be the same name without the hyphen
                vm.userProfile.jobTitle = response.SPSJobTitle();
                vm.userProfile.firstName = response.FirstName();
            }, function(error) {
                console.log(error);
            });
    }
})();