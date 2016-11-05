var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);
 
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/userdetails/:id', {
    templateUrl: 'partials/userdetails.html',
    controller: 'UserDetailsController'
  }).
  when('/userlist', {
    templateUrl: 'partials/userlist.html',
    controller: 'UserListController'
  }).
  when('/tasklist', {
    templateUrl: 'partials/tasklist.html',
    controller: 'TaskListController'
  }).
  when('/addtask', {
    templateUrl: 'partials/addtask.html',
    controller: 'AddTaskController'
  }).
  when('/taskdetails/:id', {
    templateUrl: 'partials/taskdetails.html',
    controller: 'TaskDetailsController'
  }).
  when('/edittask/:id', {
    templateUrl: 'partials/edittask.html',
    controller: 'EditTaskController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
