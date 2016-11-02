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

mp4Controllers.controller('UserDetailsController', ['$scope', 'Tasks', 'Users', '$routeParams' , function($scope, Tasks, Users,  $routeParams) {
  $scope.data = "";
  $scope.user = "";
  $scope.id = $routeParams.id;
  $scope.tasks = [];
  $scope.showCompleted = false;

  

  Users.getUser($scope.id).success(function(userdata){
    $scope.user = userdata.data;
    console.log($scope.user.name);
    Tasks.getTaskByUserName($scope.user.name).success(function(taskdata){
      $scope.data = taskdata;
    });
  });

  $scope.completeTask = function(task){
    Tasks.completeTask(task).success(function(data){
      console.log('task completed')
    });
  };

  $scope.toggleCompleted = function(){
    $scope.showCompleted = !$scope.showCompleted;
  }


}]);


mp4Controllers.controller('UserListController', ['$scope', '$http', 'Users', 'Tasks', '$window' , function($scope, $http, Users, Tasks, $window) {

  Users.get().success(function(data){
    $scope.users = data;
  });

  $scope.deleteUser = function(id){
    Users.deleteUser(id).success(function(data){ //remove user
      Tasks.deleteUser(id);                      //remove user references in tasks
      Users.get().success(function(data){        // get updated user info
        $scope.users = data;
      });  
    })
  }


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $window.sessionStorage.baseurl;

  };

}]);
