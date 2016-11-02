var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('AddUserController', ['$scope', 'Users'  , function($scope, Users) {
  $scope.username = "";
  $scope.email = "";
   $scope.displayText = ""

  $scope.addUser = function(){ 
    if ($scope.username != "" && validateEmail($scope.email)){ 
      var update = Users.addUser($scope.username, $scope.email);
      update.then(function(response) {
          $scope.displayText = response;
      });
    }
  };

  //Taken from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}]);

mp4Controllers.controller('UserDetailsController', ['$scope', 'CommonData', '$routeParams' , function($scope, CommonData,  $routeParams) {
  $scope.data = "";
  $scope.id = $routeParams.id;

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


mp4Controllers.controller('UserListController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window) {

  Users.get().success(function(data){
    $scope.users = data;
  });


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $window.sessionStorage.baseurl;

  };

}]);
