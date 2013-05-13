Sidebar.Outliner.Materials = function ( signals ) {

	var selected = null;

	var container = new UI.Panel();
	container.name = "MAT";
	container.setPadding( '10px' );

	var outliner = new UI.FancySelect().setWidth( '100%' ).setHeight('320px').setColor( '#444' ).setFontSize( '12px' ).onChange( updateOutliner );
	container.add( outliner );

	var materials = null;

  function getMaterials( scene ) {

  	materials = EDITOR.materials;

		var options = {};

		for ( var i in materials ) {

			var material = materials[ i ];

			if ( material.name == '') material.name = 'Material' + material.id;

			options[ i ] = material.name;

		}

		outliner.setOptions( options );

  }

	function updateOutliner() {

		var uuid = outliner.getValue();

		signals.selectMaterial.dispatch( materials[uuid] );

	}

	// events

  var timeout;

	signals.sceneChanged.add( function ( scene ) {

    clearTimeout( timeout );

    timeout = setTimeout( function () {

      getMaterials( scene );

    }, 100 );

	} );

	signals.selectMaterial.add( function ( material ) {

		outliner.setValue( material ? material.uuid : null );

	} );

	return container;

}
