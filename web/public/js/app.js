var app = angular.module("beacon", []);


app.controller('AddMessageController', function($scope, $http){
    $scope.name = "Beacon";
  $http.get("/api/messages").success(function(messages){
    $scope.messages = messages;
  })
  $scope.sauvegarder = function(){
    $http.post("/api/message", $scope.message)
  }
});
