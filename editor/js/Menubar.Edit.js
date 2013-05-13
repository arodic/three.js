Menubar.Edit = function ( signals ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );
	container.onMouseOver( function () { options.setDisplay( 'block' ) } );
	container.onMouseOut( function () { options.setDisplay( 'none' ) } );
	container.onClick( function () { options.setDisplay( 'none' ) } );

	var title = new UI.Panel();
	title.setTextContent( 'Edit' ).setColor( '#666' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	options.setDisplay( 'none' );
	container.add( options );

	// undo

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setId( 'sceneDriveUndo' );
	option.setTextContent( 'Undo' );
	option.onClick( function () { signals.undo.dispatch(); } );
	option.dom.style.display = 'none';
	options.add( option );

	// redo

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setId( 'sceneDriveRedo' );
	option.setTextContent( 'Redo' );
	option.onClick( function () { signals.redo.dispatch(); } );
	option.dom.style.display = 'none';
	options.add( option );

	// clone

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Clone' );
	option.onClick( function () { signals.cloneObject.dispatch(); } );
	options.add( option );

	// delete

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Delete' );
	option.onClick( function () { signals.removeObject.dispatch(); } );
	options.add( option );

	//

	return container;

}
