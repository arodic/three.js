var objectLoader = new THREE.ObjectLoader();
var sceneExporter = new THREE.ObjectExporter();

var SceneDrive = function( scene ) {

  var scope = this;

  this.APP_ID = 459393168228;
  this.CLIENT_ID = '459393168228.apps.googleusercontent.com';

  this.doc = {}

  this.scene = scene;

  this.AUTH_BUTTON_ID = 'sceneDriveAuthorize';
  this.SAVE_BUTTON_ID = 'sceneDriveSave';
  this.OPEN_BUTTON_ID = 'sceneDriveOpen';
  this.SHARE_BUTTON_ID = 'sceneDriveShare';
  this.UNDO_BUTTON_ID = 'sceneDriveUndo';
  this.REDO_BUTTON_ID = 'sceneDriveRedo';

  this.DEFAULT_TITLE = 'Untitled';

  this.listToModel = function( list, model ) {

    if ( list && model ) {
      for ( var i in list ) {
        if ( list[ i ].uuid ) {
          var data = JSON.stringify( list[ i ] );
          if ( model.get( list[ i ].uuid ) != data ) {
            model.set( list[ i ].uuid, data );
            console.log( 'Saved: ', list[ i ].type, list[ i ].uuid );
          }
        }
      }
    }

    return model;

  };

  this.modelToList = function( model, key ) {

    var list = [];
    var json;

    if ( key ) {
      json = JSON.parse( model.get( key ) );
      list.push( json );
      console.log( 'Loaded: ', json.type, key );
    } else {
      var keys = model.keys();
      for ( var id in keys ) {
        json = JSON.parse( model.get( keys[ id ] ) );
        list.push( json );
        console.log( 'Loaded: ', json.type, keys[ id ] );
      } 
    }

    return list;

  };

  this.init = function() {

    this.realTimeLoader = new rtclient.RealtimeLoader( this.realTimeOptions );

    this.connectUi();
    this.realTimeLoader.start();
    this.initSignals();

  };

  this.initSignals = function() {

    var timeout = {};

    signals.objectChanged.add( function( object ) {  


      if ( rtclient.params['fileId'] && EDITOR.objects[object.uuid] ) {

        clearTimeout( timeout[object.uuid] );

        timeout[object.uuid] = setTimeout( function ( ) {

          scope.save( object );

        }, 100 );

      }

    });

    signals.addObject.add( function( object ) {

      if ( rtclient.params['fileId'] ) {
        
        scope.save( object );

      }

    } );

    signals.objectRemoved.add( function( object ) {

      object.traverse( function( object ) {

        if ( rtclient.params['fileId'] && scope.doc.objects ) {
            
          scope.doc.objects.delete( object.uuid );
          delete EDITOR.objects[ object.uuid ];
          console.log( 'Deleted object: ', object.uuid );

        }

      } );

    } );

    signals.undo.add( function() {
     
      if ( rtclient.params['fileId'] ) {

        scope.model.undo();
        signals.sceneChanged.dispatch( scope.scene );

      }
     
    } );

    signals.redo.add( function() {

      if ( rtclient.params['fileId'] ) {

        scope.model.redo();

      }

    } );

  }

  this.createModel = function( model ) {

    model.getRoot().set( 'geometries', model.createMap() );
    model.getRoot().set( 'materials', model.createMap() );
    model.getRoot().set( 'textures', model.createMap() );
    model.getRoot().set( 'objects', model.createMap() );

  };

  this.getModel = function( model ) {

    this.model = model;
    this.doc.geometries = model.getRoot().get( 'geometries' );
    this.doc.materials = model.getRoot().get( 'materials' );
    this.doc.textures = model.getRoot().get( 'textures' );
    this.doc.objects = model.getRoot().get( 'objects' );

  };

  this.initializeModel = function( model ) {

    scope.createModel( model );
    scope.getModel( model );

    console.log('Initializing from local storage...');
    scope.save( localStorage.threejsEditor );

  };

  this.save = function( object ) {

    var json;
    var parent;

    if ( typeof object == 'string' ) {
      json = JSON.parse( object );
    }

    if ( typeof object == 'object' ) {
      json = sceneExporter.parse( object );
      parent = object.parent ? object.parent.uuid : undefined;
    }

    SceneDriveUtils.flattenObjects( json, parent );
    SceneDriveUtils.remapToUuids( json );

    if ( !this.READ_ONLY ){
      this.listToModel( json.geometries, this.doc.geometries );
      this.listToModel( json.materials, this.doc.materials );
      this.listToModel( json.object, this.doc.objects );
    }

  };

  this.onFileLoaded = function( file ) {

    console.log('File loaded');

    scope.getModel( file.getModel() );

    scope.loadGeometries();
    scope.loadMaterials();
    scope.loadObjects();

    scope.connectRealtime();

    document.getElementById( scope.SHARE_BUTTON_ID ).style.display = 'block';
    document.getElementById( scope.SAVE_BUTTON_ID ).style.display = 'none';

  };

  this.loadGeometries = function() {

    var list = scope.modelToList( scope.doc.geometries );
    var geometries = objectLoader.parseGeometries( list );

    for ( var i in geometries ) {
      var uuid = geometries[ i ].uuid;
      console.log('Loading geometry');
      if ( EDITOR.geometries[ uuid ]) {
        // TODO: update geometry
        //EDITOR.geometries[ uuid ] = geometries[ i ];
      } else {
        EDITOR.geometries[ uuid ] = geometries[ i ];
      }
    }

  };

  this.loadMaterials = function( ) {

    var list = scope.modelToList( scope.doc.materials ); 
    var materials = objectLoader.parseMaterials( list );

    for ( var i in materials ) {
      var uuid = materials[ i ].uuid;
      if ( EDITOR.materials[ uuid ]) {
        // TODO: update geometry
        //SceneDriveUtils.copyObject( EDITOR.materials[ uuid ], materials[ i ] );
        //delete materials[ i ];
      } else {
        EDITOR.materials[ uuid ] = materials[ i ];
      }
    }

  };

  this.loadObjects = function( event ) {

    if ( event && event.newValue == null && EDITOR.objects[ event.property ] ) {

      signals.removeObject.dispatch( EDITOR.objects[ event.property ] );
    
    } else {

      if ( event && event.property ){

        var list = scope.modelToList( scope.doc.objects, event.property );
     
      } else {

        var list = scope.modelToList( scope.doc.objects );

      }

      for ( var i in list ) {

        var uuid = list[ i ].uuid;

        var object = objectLoader.parseObject( list[ i ], EDITOR.geometries, EDITOR.materials );

        if ( object instanceof THREE.Scene ){

          delete EDITOR.objects[ scope.scene.uuid ];
          SceneDriveUtils.copyObject( scope.scene, object );
          scope.scene.uuid = object.uuid;
          EDITOR.objects[ scope.scene.uuid ] = scope.scene;

        } else {

          if ( EDITOR.objects[ uuid ] ) {
            SceneDriveUtils.copyObject( EDITOR.objects[ uuid ], object );
            delete object;
          } else {
            EDITOR.objects[ uuid ] = object;
          }

        }
      
      }

      for ( var i in list ) {
        
        var uuid = list[ i ].uuid;

        var object = EDITOR.objects[ uuid ];

        var model = JSON.parse( scope.doc.objects.get( uuid ) );
        var parentUuid = model.parent;

        var parent = EDITOR.objects[ parentUuid ];
        
        if ( object.parent != parent ) {
          signals.addObject.dispatch( object, parent );
        }

      }

      signals.sceneChanged.dispatch( scope.scene );

    }

  };

  this.saveNew = function() {

    if ( this.scene.children.length == 0 ) {

      alert('Nothing to save.');
      return;

    }

    if ( !(rtclient.params['fileId']) ) {

      console.log('Saving to local storage');
      localStorage.threejsEditor = JSON.stringify( sceneExporter.parse( this.scene ) );
      this.realTimeOptions.defaultTitle = prompt( "Scene Title", this.DEFAULT_TITLE );
      this.realTimeLoader = new rtclient.RealtimeLoader( this.realTimeOptions );
      this.realTimeLoader.createNewFileAndRedirect();

    }

  };

  this.openFromDrive = function(data) {

    if (data.action == google.picker.Action.PICKED ) {
      var fileId = data.docs[0].id;
      delete localStorage.threejsEditor;
      rtclient.redirectTo( fileId, scope.realTimeLoader.authorizer.userId );
    }

  };

  this.popupShare = function() {

    var shareClient = new gapi.drive.share.ShareClient( this.realTimeOptions.appId );
    shareClient.setItemIds([rtclient.params['fileId'] ]);
    shareClient.showSettingsDialog();

  };

  this.connectRealtime = function() {

    this.doc.geometries.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, this.loadGeometries );
    this.doc.materials.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, this.loadMaterials );
    this.doc.objects.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, this.loadObjects );
    this.model.addEventListener( gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.onUndoRedoStateChanged );

  };

  this.popupOpen = function() {

    var token = gapi.auth.getToken().access_token;
    var view = new google.picker.View( google.picker.ViewId.DOCS );
    view.setMimeTypes( 'application/vnd.google-apps.drive-sdk.' + this.realTimeOptions.appId );
    var picker = new google.picker.PickerBuilder()
    .enableFeature( google.picker.Feature.NAV_HIDDEN )
    .setAppId( this.realTimeOptions.appId )
    .setOAuthToken( token )
    .addView( view)
    .addView(new google.picker.DocsUploadView() )
    .setCallback( this.openFromDrive)
    .build();
    picker.setVisible( true);

  };

  this.connectUi = function() {

    document.getElementById( scope.SAVE_BUTTON_ID ).onclick = function() {
      scope.saveNew();
    };
    document.getElementById( scope.OPEN_BUTTON_ID ).onclick = function() {
      scope.popupOpen()
    };
    document.getElementById( scope.SHARE_BUTTON_ID ).onclick = function() {
      scope.popupShare()
    };

  };

  this.onAuth = function( success ) {

    if ( success ){
    
      document.getElementById( scope.OPEN_BUTTON_ID ).style.display = 'block';
      document.getElementById( scope.SAVE_BUTTON_ID ).style.display = 'block';
      document.getElementById( scope.AUTH_BUTTON_ID ).style.display = 'none';

    }

  };

  this.onUndoRedoStateChanged = function( e ) {

    document.getElementById( scope.UNDO_BUTTON_ID ).style.display = e.canUndo ? 'block' : 'none';
    document.getElementById( scope.REDO_BUTTON_ID ).style.display = e.canRedo ? 'block' : 'none';

  }

  this.onMetadata = function(resp) {

    if (resp.code == 403) alert('Error 403: Authorization required', resp);
    if (resp.code == 404) alert('Error 404: File does not exist or access denied', resp);
    if (resp.editable !== undefined && resp.editable == false) {

      document.getElementById( scope.SAVE_BUTTON_ID ).style.display = 'none';
      this.READ_ONLY = true;

    }

  }

  this.realTimeOptions = {
    appId: this.APP_ID,
    clientId: this.CLIENT_ID,
    authButtonElementId: this.AUTH_BUTTON_ID,
    autoCreate: false,
    initializeModel: this.initializeModel,
    onAuth: this.onAuth,
    onFileLoaded: this.onFileLoaded,
    onMetadata: this.onMetadata,
    defaultTitle: this.DEFAULT_TITLE
  };

}

google.load( 'picker', '1' );