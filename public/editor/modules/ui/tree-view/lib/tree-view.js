/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
require('../css/tree/init.less')
require('../css/tree-view/init.less')
var Element = require('./element.js')
var DataChanged = {
  componentDidMount: function () {
    this.props.api.reply('data:changed', function (data) {
      this.setState({ data: data })
    }.bind(this))
  },
  getInitialState: function () {
    return {
      data: []
    }
  }
}
var Layout = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  mixins: [ DataChanged ],
  getElements: function () {
    let elementsList
    let document = vcCake.getService('document')
    if (this.state.data) {
      elementsList = this.state.data.map(function (element) {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} level={1} api={this.props.api} />
      }, this)
    }
    return elementsList
  },
  render: function () {
    return (
      <div className="vcv-ui-tree-layout-container">
        <div className="vcv-ui-scroll-container">
          <div className="vcv-ui-scroll">
            <div className="vcv-ui-scroll-content">
              <ul ref="scrollable" className="vcv-ui-tree-layout">
                {this.getElements()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
module.exports = Layout
