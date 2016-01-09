/**
 * Created by mchoraine on 17/12/2015.
 */
var app = angular.module("beacon");

app.service('GroupeAPI', function($resource, $location) {
  var resource;
  resource = $resource($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/groupes/:id', {}, {
    'get': {
      method: "GET",
      isArray: true
    },
    'save': {
      method: "POST",
      isArray: false,
      params:{id: '@id'}
    }
  });
  return resource;
});


app.service('BeaconAPI', function($resource, $location) {
  var resource;
  resource = $resource($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/beacons/:id', {}, {
    'get': {
      method: "GET",
      isArray: true
    },
    'save': {
      method: "POST",
      isArray: false
    },
    'delete': {
      method: "DELETE",
      isArray: false
    }
  });
  return resource;
});


app.service('UserAPI', function($resource, $location) {
  var resource;
  resource = $resource($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/users/:id', {}, {
    'get': {
      method: "GET",
      isArray: true
    },
    'getGroupes': {
      method: "GET",
      isArray: true,
      params : {
        id : "groupes"
      }
    },
    'save': {
      method: "POST",
      isArray: false
    },
    'delete': {
      method: "DELETE",
      isArray: false
    }
  });
  return resource;
});