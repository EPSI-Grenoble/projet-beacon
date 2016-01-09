/**
 * Created by mchoraine on 19/12/2015.
 */
var getProximity = function (proximity) {
  var proximityList = [];
  switch (proximity) {
    case "ProximityFar" :
      proximityList.push("ProximityFar");
      proximityList.push("ProximityUnknown");
      break;
    case "ProximityNear" :
      proximityList.push("ProximityFar");
      proximityList.push("ProximityNear");
      proximityList.push("ProximityUnknown");
      break;
    case "ProximityImmediate" :
      proximityList.push("ProximityFar");
      proximityList.push("ProximityNear");
      proximityList.push("ProximityImmediate");
      proximityList.push("ProximityUnknown");
      break;
  }
  console.log(proximityList)
  return proximityList;
};

module.exports = {

  findBeaconToListenForUser: function (idUser) {
    return {
      destinataires: idUser,
      typeMessage: "beacon",
      receiveBy:  {
        $not : {
          $in : [idUser]
        }
      }
    }
  },


  findMessageForUserWithThisBeacon: function (idUser, idBeacon, proximity) {
    return {
      beacons: idBeacon,
      destinataires: idUser,
      receiveBy: {$ne: idUser},
      beaconsProximity: {$in: getProximity(proximity)}
    }
  }
};
