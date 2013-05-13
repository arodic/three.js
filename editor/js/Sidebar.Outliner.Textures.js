Sidebar.Outliner.Textures = function ( signals ) {

	var selected = null;

	var container = new UI.Panel();
	container.name = "TEX";
	container.setPadding( '10px' );

	var outliner = new UI.FancySelect().setWidth( '100%' ).setHeight('320px').setColor( '#444' ).setFontSize( '12px' ).onChange( updateOutliner );
	container.add( outliner );

	var textures = null;

  function getTextures( scene ) {

  	textures = EDITOR.textures;

		var options = {};

		for ( var i in textures ) {

			var texture = textures[ i ];

			if ( texture.name == '') texture.name = 'Texture' + texture.id;

			options[ i ] = texture.name;

		}

		outliner.setOptions( options );

  }

	function updateOutliner() {

		var uuid = parseInt( outliner.getValue() );

		//signals.selectObject.dispatch( textures[uuid] );

	}

	// events

  var timeout;

	signals.sceneChanged.add( function ( scene ) {

    clearTimeout( timeout );

    timeout = setTimeout( function () {

      getTextures( scene );

    }, 100 );

	} );

	signals.selectObject.add( function ( object ) {

		outliner.setValue( object ? object.id : null );

	} );

	return container;

}
