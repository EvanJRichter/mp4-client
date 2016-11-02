var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    var getLogic = function() {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl+'/api/users');
    };
    var getUserLogic = function(id) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl+'/api/users/'+id);
    };
    var addUserLogic = function(nameinput, emailinput) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.post(baseUrl+'/api/users', { name: nameinput, email: emailinput});
    };
    var deleteUserLogic = function(id) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.delete(baseUrl+'/api/users/'+id);
    };
    return {
        get: getLogic,
        getUser: getUserLogic,
        addUser: addUserLogic,
        deleteUser: deleteUserLogic
    };
});

mp4Services.factory('Tasks', function($http, $window) {
    var getLogic = function() {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl+'/api/tasks');
    };
    var getTaskByUserLogic = function(userid){
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl+'/api/tasks?where={"assignedUser": "'+ userid +'"}'); 
    }
    var getTaskByUserNameLogic = function(username){
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.get(baseUrl+'/api/tasks?where={"assignedUserName": "'+ username +'"}'); 
    }
    var unassignTaskLogic = function(task){
        var baseUrl = $window.sessionStorage.baseurl;
        task.assignedUserName = "";
        return $http.put(baseUrl+'/api/tasks/' + task.id, task); 
    }
    var completeTaskLogic = function(task){
        console.log(task)
        var baseUrl = $window.sessionStorage.baseurl;
        task.completed = "True";
        return $http.put(baseUrl+'/api/tasks/' + task._id, task); 
    }
    var deleteUserLogic = function(username){
        getTaskByUserNameLogic(username).success(function(data){
            data.data.forEach(function(task){
                unassignTaskLogic(task).failure(function(data){
                    return data;
                });
            }) 
        })
        .failure(function(data){
            return data;
        });
    }
    return {
        get : getLogic,
        getTaskByUser : getTaskByUserLogic,
        getTaskByUserName : getTaskByUserNameLogic,
        deleteUser : deleteUserLogic,
        completeTask : completeTaskLogic
    };
});
