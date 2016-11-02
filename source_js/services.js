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
        return $http.get(baseUrl+'/api/users?where={"_id": ' + id + '"}');
    };
    var addUserLogic = function(nameinput, emailinput) {
        var baseUrl = $window.sessionStorage.baseurl;
        return $http.post(baseUrl+'/api/users', { name: nameinput, email: emailinput});
    };
    return {
        get: getLogic,
        getUser: getUserLogic,
        addUser: addUserLogic
    };
});

mp4Services.factory('Tasks', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/tasks');
        }
    }
});
