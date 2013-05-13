var SceneDriveUtils = {};

SceneDriveUtils.flattenObjects = function( json, parent ) {

  function iterateChildren( list, output, parent ) {

    for ( var i in list ) {

      list[ i ].parent = parent;
      output.push( list[ i ] );

      iterateChildren( list[ i ].children, output, list[ i ].uuid );

      delete list[ i ].children;
    
    }

  }

  list = ( json.object instanceof Array ) ? json.object : [ json.object ];

  json.object = [];

  iterateChildren( list, json.object, parent );

};

SceneDriveUtils.remapToUuids = function( json ) {

  for ( var i in json.object ) {

    if ( json.object[ i ][ 'geometry' ] !== undefined ) {
      if ( json.geometries[ json.object[ i ][ 'geometry' ] ]) {
        var uuid = json.geometries[ json.object[ i ][ 'geometry' ] ].uuid;
        json.object[ i ][ 'geometry' ] = uuid;
      }
    }

    if ( json.object[ i ][ 'material' ] !== undefined ) {
      if ( json.materials[ json.object[ i ][ 'material' ] ]) {
        var uuid = json.materials[ json.object[ i ][ 'material' ] ].uuid;
        json.object[ i ][ 'material' ] = uuid;
      }
    }

  }

};

SceneDriveUtils.copyObject = function ( target, source ) {
  
  for (i in source) {

    var type = typeof target[ i ];

    if ( type == "function" ) {

      return;

    } else if ( type == "boolean" || type == "string" || type == "number" ) {

      if ( i != "id" && i != "uuid" && target.hasOwnProperty(i) ) {

        target[ i ] = source[ i ];

      }

    } else if ( i == 'userData' ) {

      target[ i ] = JSON.parse( JSON.stringify( source[ i ] ) );

    } else {

      try
      {
        target[ i ].copy( source[ i ]);
      }
      catch( err )
      {
        //console.log( err, i, type, source[ i ]);
      }

    }

  }

};