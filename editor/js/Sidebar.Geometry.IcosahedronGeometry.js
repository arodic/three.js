Sidebar.Geometry.IcosahedronGeometry = function ( signals, geometry ) {

	var container = new UI.Panel();
	container.setBorderTop( '1px solid #ccc' );
	container.setPaddingTop( '10px' );

	// radius

	var radiusRow = new UI.Panel();
	var radius = new UI.Number( geometry.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ).setColor( '#666' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// detail

	var detailRow = new UI.Panel();
	var detail = new UI.Integer( geometry.detail ).setRange( 0, Infinity ).onChange( update );

	detailRow.add( new UI.Text( 'Detail' ).setWidth( '90px' ).setColor( '#666' ) );
	detailRow.add( detail );

	container.add( detailRow );


	//

	function update() {

		var uuid = geometry.uuid;
		var name = geometry.name;
		var object;

		EDITOR.geometries[uuid] = new THREE.IcosahedronGeometry(
			radius.getValue(),
			detail.getValue()
		);

		EDITOR.geometries[uuid].computeBoundingSphere();
		EDITOR.geometries[uuid].uuid = uuid;
		EDITOR.geometries[uuid].name = name;

		for ( var i in EDITOR.objects ) {

			object = EDITOR.objects[i];

			if ( object.geometry && object.geometry.uuid == uuid ) {

				delete object.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)
				object.geometry.dispose();

				object.geometry = EDITOR.geometries[uuid];

				signals.objectChanged.dispatch( object );

			}

		}

	}

	return container;

}
