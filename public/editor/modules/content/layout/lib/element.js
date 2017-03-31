import vcCake from 'vc-cake'
import React from 'react'
import ContentControls from '../../../../../resources/components/layoutHelpers/contentControls/component'
import ContentEditableComponent from './helpers/contentEditable/contentEditableComponent'
import ColumnResizer from '../../../../../resources/columnResizer/columnResizer'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.instantDataUpdate = this.instantDataUpdate.bind(this)
    this.state = {
      element: props.element
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({element: nextProps.element})
  }
  componentDidMount () {
    this.props.api.notify('element:mount', this.state.element.id)
    vcCake.onDataChange(`element:instantMutation:${this.state.element.id}`, this.instantDataUpdate)
  }
  instantDataUpdate (data) {
    this.setState({element: data || this.props.element})
  }
  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.state.element.id)
    vcCake.ignoreDataChange(`element:instantMutation:${this.state.element.id}`, this.instantDataUpdate)
  }

  getContent () {
    const currentElement = cook.get(this.state.element) // optimize
    let elementsList = []
    DocumentData.children(currentElement.get('id')).map((childElement) => {
      elementsList.push(<Element element={childElement} key={childElement.id} api={this.props.api} />)
      if (vcCake.env('FEATURE_COLUMN_RESIZER')) {
        if (childElement.tag === 'column') {
          elementsList.push(
            <ColumnResizer key={`columnResizer-${childElement.id}`} linkedElement={childElement.id} api={this.props.api} />
          )
        }
      }
    })
    return elementsList.length ? elementsList : <ContentControls api={this.props.api} id={currentElement.get('id')} />
  }

  visualizeAttributes (element) {
    let layoutAtts = {}
    let atts = element.getAll()
    Object.keys(atts).forEach((key) => {
      let attrSettings = element.settings(key)
      if (attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[ key ] = <ContentEditableComponent id={atts.id} field={key} fieldType={attrSettings.type.name} api={this.props.api} options={attrSettings.settings.options}>
          {atts[ key ] || ''}
        </ContentEditableComponent>
      } else {
        layoutAtts[ key ] = atts[ key ]
      }
    })
    return layoutAtts
  }

  render () {
    let el = cook.get(this.state.element)
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    let editor = {
      'data-vcv-element': id
    }
    if (el.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }
    return <ContentComponent id={id} key={'vcvLayoutContentComponent' + id} atts={this.visualizeAttributes(el)}
      api={this.props.api}
      editor={editor}>
      {this.getContent()}
    </ContentComponent>
  }
}
