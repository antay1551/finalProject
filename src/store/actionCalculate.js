let actionsMaker = (name, latLngFrom, latLngTo) => {
    console.log('111111111111-');

    console.log(latLngFrom);
    console.log(latLngTo);
    console.log(name);
    
    //actionThunk();
    console.log('wwwww');
    
    const actionPending     = () => ({ type: 'PROMISE', name, status: 'PENDING', payload: null, error: null })
    const actionResolved    = payload => ({ type: 'PROMISE', name, status: 'RESOLVED', payload, error: null })
    const actionRejected    = error => ({ type: 'PROMISE', name, status: 'REJECTED', payload: null, error })
  
   function actionThunk(){
        return async dispatch => {
            dispatch(actionPending())
            let data = await dispatch(actionRejected())
            console.log('itts okkkkk');
            const google = window.google;
            const matrix = new google.maps.DistanceMatrixService();
            matrix.getDistanceMatrix({
                origins: [new google.maps.LatLng(latLngFrom.lat, latLngFrom.lng)],
                destinations: [new google.maps.LatLng(latLngTo.lat, latLngTo.lng)],
                travelMode: google.maps.TravelMode.DRIVING,
              }, 
                function(response, status) {
                    if(status === 'OK'){
                      var data = response.rows[0].elements[0];
                              //store.dispatch(res);
                              dispatch(actionResolved(data))
                    } 
                      });
                      
                  }
    }
   return actionThunk();
  }  
  
export default actionsMaker;