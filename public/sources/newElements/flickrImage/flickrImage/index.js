import vcCake from 'vc-cake'
import FlickrImage from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(FlickrImage);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' )},
  ''
)
