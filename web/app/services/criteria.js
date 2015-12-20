/**
 * Created by mchoraine on 19/12/2015.
 */
module.exports = {

  findBeaconToListenForUser : function(idUser){
    return {
      destinataires: idUser,
      typeMessage: "beacon",
      receiveBy: {$ne : idUser}
    }
  },


  findMessageForUserWithThisBeacon : function(idUser, idBeacon){
    return {
      beacons: idBeacon,
      destinataires : idUser
    }
  }

};
