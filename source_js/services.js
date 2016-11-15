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
    var baseUrl = $window.sessionStorage.baseurl;

    var getLogic = function() {
        return $http.get(baseUrl+'/api/users?select={"name": 1, "email": 1}');
    };
    var getUserLogic = function(id) {
        return $http.get(baseUrl+'/api/users/'+id);
    };
    var addUserLogic = function(nameinput, emailinput) {
        return $http.post(baseUrl+'/api/users', { name: nameinput, email: emailinput});
    };
    var deleteUserLogic = function(id) {
        removeTaskLogic(id);
        return $http.delete(baseUrl+'/api/users/'+id);
    };
        
    var removeTaskLogic = function(id){
        getLogic().success(function(data){
            data.data.forEach(function(user){
                i = user.pendingTasks.indexOf(id);
                if (i >= 0){
                    user.pendingTasks.splice(i, 0);
                    $http.put(baseUrl+'/api/tasks/' + user._id, user); 
                }
            });
        });
    }

    return {
        get: getLogic,
        getUser: getUserLogic,
        addUser: addUserLogic,
        deleteUser: deleteUserLogic
    };
});

mp4Services.factory('Tasks', function($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    
    var getLogic = function() {
        return $http.get(baseUrl+'/api/tasks');
    };
    var getTaskLogic = function(id) {
        return $http.get(baseUrl+'/api/tasks/'+id);
    };
    var getFilteredLogic = function(type, startplace, sort, ascending) {
        var url = baseUrl+'/api/tasks?skip=' + startplace + '&limit=10&sort={"' + sort + '": ' + ascending + '}';
        if (type != "All"){
            var completed = (type === "Completed");
            url += '&where={completed:'+ completed +'}'
        }
        return $http.get(url);
    };
    var getTaskByUserLogic = function(userid){
        return $http.get(baseUrl+'/api/tasks?where={"assignedUser": "'+ userid +'"}'); 
    };
    var getTaskByUserNameLogic = function(username){
        return $http.get(baseUrl+'/api/tasks?where={"assignedUserName": "'+ username +'"}'); 
    };
    var unassignTaskLogic = function(task){
        task.assignedUserName = "";
        return $http.put(baseUrl+'/api/tasks/' + task.id, task); 
    };
    var completeTaskLogic = function(task, completed){
        task.completed = completed;
        return $http.put(baseUrl+'/api/tasks/' + task._id, task); 
    };
    var deleteUserLogic = function(username){
        getTaskByUserNameLogic(username).success(function(data){
            data.data.forEach(function(task){
                unassignTaskLogic(task).error(function(data){
                    return data;
                });
            }) 
        })
        .error(function(data){
            console.log("got error", data);
            return data;
        });
    };
    var addTaskLogic = function(_name, _description, _deadline, _username, _userid){
        console.log(_userid, _username);
        
        return $http.post(baseUrl+'/api/tasks/', {
            name: _name, 
            deadline: _deadline, 
            description: _description, 
            assignedUser: _userid,
            assignedUserName: _username
        }); 
    };
    var editTaskLogic = function(_task, _username, _userid){        
        return $http.put(baseUrl+'/api/tasks/'+_task._id, {
            name: _task.name, 
            deadline: _task.deadline, 
            description: _task.description, 
            assignedUser: _userid,
            assignedUserName: _username
        }); 
    };
    var deleteTaskLogic = function(id){
        return $http.delete(baseUrl+'/api/tasks/'+id);
    };
    return {
        get : getLogic,
        getTask : getTaskLogic,
        getFiltered : getFilteredLogic,
        getTaskByUser : getTaskByUserLogic,
        getTaskByUserName : getTaskByUserNameLogic,
        deleteUser : deleteUserLogic,
        completeTask : completeTaskLogic,
        deleteTask : deleteTaskLogic,
        addTask : addTaskLogic,
        editTask : editTaskLogic
    };
});
