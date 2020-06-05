import React from 'react'
import classNames from 'classnames'
import { getStorage, env } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

export default class InsightsGroup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false
    }

    this.handleToggleExpand = this.handleToggleExpand.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter (domNode) {
    if (domNode) {
      workspaceStorage.state('userInteractWith').set(domNode)
    }
  }

  handleMouseLeave () {
    workspaceStorage.state('userInteractWith').set(false)
  }

  getInsightItems (items) {
    return items.map((item, index) => {
      let goToButton = null
      if (item.elementID) {
        goToButton = (
          <button
            onClick={this.handleGoToElement.bind(this, item.elementID)}
            className='vcv-insight-go-to-action vcv-ui-icon vcv-ui-icon-edit'
          />
        )
      }

      return (
        <div
          className='vcv-insight-item'
          key={`insights-item-${item.type}-${index}`}
          onMouseOver={this.handleMouseEnter.bind(this, item.domNode)}
          onMouseLeave={this.handleMouseLeave}
        >
          {item.thumbnail && (
            <img className='vcv-insight-item-thumbnail' src={item.thumbnail} alt='thumbnail' />
          )}
          <span className='vcv-insight-item-description'>{item.description}</span>
          {goToButton}
        </div>
      )
    })
  }

  handleGoToElement (elementID) {
    const iframe = env('iframe')
    const editorEl = iframe.document.querySelector(`#el-${elementID}`)
    iframe.scrollTo({ top: editorEl.offsetTop, behavior: 'smooth' })
    workspaceStorage.trigger('edit', elementID, '')
  }

  handleToggleExpand () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { insightGroup, type } = this.props

    const filteredItems = insightGroup.items.filter(item => !!item.description)

    let collapseButton = null
    if (filteredItems.length) {
      const expandClasses = classNames({
        'vcv-ui-icon': true,
        'vcv-ui-icon-expand': !this.state.expanded,
        'vcv-ui-icon-arrow-up': this.state.expanded,
        'vcv-insight-collapse-button': true
      })
      collapseButton = (
        <button
          onClick={this.handleToggleExpand}
          className={expandClasses}
        />
      )
    }

    return (
      <div className={`vcv-insight vcv-insight-${insightGroup.state}`} key={`insights-group-${type}`}>
        <div className='vcv-insight-header'>
          <span className='vcv-insight-title'>{insightGroup.title}</span>
          <span className='vcv-insight-description'>{insightGroup.description}</span>
          {collapseButton}
        </div>
        {filteredItems.length && this.state.expanded ? (
          <div className='vcv-insight-items'>
            {this.getInsightItems(filteredItems)}
          </div>
        ) : null}
      </div>
    )
  }
}
