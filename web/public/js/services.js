var app = angular.module("beacon");

app.service('GroupeAPI', function($resource, $location) {
  var resource;
  resource = $resource($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/groupes/:id/:action', {}, {
    'get': {
      method: "GET",
      isArray: true
    },
    'getMembres': {
      method: "GET",
      isArray: true,
      params : {action : "membres"}
    },
    'removeMembres': {
      method: "DELETE",
      isArray: false,
      params : {action : "membres"}
    },
    addToGroupe : {
      method: "POST",
      isArray: false,
      params : {action : "add"}
    },
    'save': {
      method: "POST",
      isArray: false,
      params:{id: '@id'}
    },
    'delete': {
      method: "DELETE",
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

app.service('GuestAPI', function($resource, $location) {
  var resource;
  resource = $resource($location.protocol() + '://' + $location.host() + ':' + $location.port() + '/api/guests/:id', {}, {
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

