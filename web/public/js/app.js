var app = angular.module("beacon", ["ckeditor"]);


app.controller('AddMessageController', function($scope, $http){
  $http.get("/api/message").success(function(messages){
    $scope.messages = messages;
  })
  $scope.sauvegarder = function(){
      console.log($scope.message);
    $http.post("/api/message", $scope.message)
  }
});
