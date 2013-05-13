Sidebar.Outliner.Geometries = function ( signals ) {

	var selected = null;

	var container = new UI.Panel();
	container.name = "GEO";
	container.setPadding( '10px' );

	var outliner = new UI.FancySelect().setWidth( '100%' ).setHeight('320px').setColor( '#444' ).setFontSize( '12px' ).onChange( updateOutliner );
	container.add( outliner );

	var geometries = null;

  function getGeometries( scene ) {

  	geometries = EDITOR.geometries;

		var options = {};

		for ( var i in geometries ) {

			var geometry = geometries[ i ];

			if ( geometry.name == '') geometry.name = 'Geometry' + geometry.id;

			options[ i ] = geometry.name;

		}

		outliner.setOptions( options );

  }

	function updateOutliner() {

		var uuid = outliner.getValue();

		signals.selectGeometry.dispatch( geometries[uuid] );

	}

	// events

  var timeout;

	signals.sceneChanged.add( function ( scene ) {

    clearTimeout( timeout );

    timeout = setTimeout( function () {

      getGeometries( scene );

    }, 100 );

	} );

	signals.selectGeometry.add( function ( geometry ) {

		outliner.setValue( geometry ? geometry.uuid : null );

	} );

	return container;

}
