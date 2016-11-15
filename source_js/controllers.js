var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('AddUserController', ['$scope', 'Users'  , function($scope, Users) {
  $scope.username = "";
  $scope.email = "";
   $scope.displayText = "";

  $scope.addUser = function(){ 
    if ($scope.username != "" && validateEmail($scope.email)){ 
      Users.addUser($scope.username, $scope.email).success(function(response) {
        $scope.displayText = response.message;
      }).error(function(response){
        $scope.displayText = response.message;
      });
    }  
  };

  //Taken from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}]);
 
mp4Controllers.controller('AddTaskController', ['$scope', 'Tasks', 'Users', function($scope, Tasks, Users) {
  $scope.name = "";
  $scope.description = ""; 
  $scope.deadline = "";
  $scope.userchoice = '{"name":"unassigned","_id":"" }';
  $scope.users = [];

  Users.get().success(function(userdata){ 
    $scope.users = userdata.data;
  });

  $scope.addTask = function(){ 
    if ($scope.username != "" && $scope.deadline != ""){ 
      $scope.displayText = "";
      $scope.userchoice = JSON.parse($scope.userchoice);
      Tasks.addTask($scope.name, $scope.description, $scope.deadline, $scope.userchoice.name, $scope.userchoice._id ).success(function(response) {
        $scope.displayText = response.message;
        $scope.userchoice = JSON.stringify($scope.userchoice);
      }).error(function(response){
        $scope.displayText = response.message;
      });
    }
  };
}]);

mp4Controllers.controller('EditTaskController', ['$scope', 'Tasks', 'Users', '$routeParams', function($scope, Tasks, Users, $routeParams) {
  $scope.id = $routeParams.id;
  $scope.task = "";
  $scope.displayText = "";
  $scope.userchoice = "";
  $scope.users = [];

  $scope.initTask = function(){
    Tasks.getTask($scope.id).success(function(taskdata){
      $scope.task = taskdata.data;
      Users.get().success(function(userdata){ 
        $scope.users = userdata.data;
        $scope.users.forEach(function(user){ 
          if (user.name === $scope.task.assignedUserName){
            $scope.userchoice = JSON.stringify(user);
            console.log("THIS IS USERCHOICE: ", $scope.userchoice);
          }
        });
      });

    });
  }

  $scope.editTask = function(){ 
    if ($scope.task.name != "" && $scope.task.deadline != ""){ 
      $scope.userchoice = JSON.parse($scope.userchoice);
      Tasks.editTask($scope.task, $scope.userchoice.name, $scope.userchoice._id ).then(function(response) {
          console.log("changing display text to ", response.data.message)
          $scope.displayText = response.data.message;
          $scope.initTask();
      });
    }
  };

  $scope.rightOption = function(user){
    return (user.name === JSON.parse($scope.userchoice).name);
  }

  $scope.initTask();
}]);

mp4Controllers.controller('UserDetailsController', ['$scope', 'Tasks', 'Users', '$routeParams' , function($scope, Tasks, Users,  $routeParams) {
  $scope.data = "";
  $scope.user = "";
  $scope.displayText = "";
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
    Tasks.completeTask(task, true).success(function(data){
      $scope.displayText = data.data.message;
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
    Users.deleteUser(id).success(function(delete_data){ //remove user
      Tasks.deleteUser(id);                      //remove user references in tasks
      Users.get().success(function(data){        // get updated user info
        $scope.users = data;
        $scope.displayText = delete_data.data.message;
      });  
    })
  }


}]);


mp4Controllers.controller('TaskListController', ['$scope', '$http', 'Users', 'Tasks', '$window' , function($scope, $http, Users, Tasks, $window) {
  $scope.tasks = [];
  $scope.start = 0;

  $scope.ascending = -1;
  var oldascend = "-1";

  $scope.sortoptions = [
      "name", "username", "dateCreated", "deadline"
  ];

  $scope.sort = "name";
  var oldsort = "name";

  $scope.type = "Pending";
  var oldtype = "Pending";

  $scope.getFilteredTasks = function(){
    Tasks.getFiltered($scope.type, $scope.start, $scope.sort, $scope.ascending).success(function(data){
      $scope.tasks = data;
    });
  };

  $scope.changedFilter = function(){
    console.log($scope.sort);
    if ($scope.type != oldtype || $scope.ascending != oldascend || $scope.sort != oldsort){
      oldtype = $scope.type;
      oldascend = $scope.ascending;
      oldsort = $scope.sort;
    } 
    $scope.start = 0;
    $scope.getFilteredTasks();
  }

  $scope.changeStart = function(amt){
    console.log(amt, $scope.start);
    if ($scope.start + amt >= 0){
      $scope.start += amt;
    }
    console.log($scope.start);

    $scope.getFilteredTasks();
  }

  $scope.deleteTask = function(id){
    Tasks.deleteTask(id).success(function(data){
      $scope.getFilteredTasks();
    });
  };

  $scope.getFilteredTasks();

}]); 


mp4Controllers.controller('TaskDetailsController', ['$scope', 'Tasks', '$routeParams' , function($scope, Tasks,  $routeParams) {
  $scope.id = $routeParams.id;
  $scope.task = "";
  $scope.displayText = "";

  Tasks.getTask($scope.id).success(function(taskdata){
    $scope.task = taskdata.data;
  });

  $scope.completeTask = function(complete){
    Tasks.completeTask($scope.task, complete).success(function(data){
      $scope.displayText = data.data.message;
    });
  };


}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $window.sessionStorage.baseurl;

  };

}]);
