import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class AttachImageItem extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  static displayName = 'vcv-ui-form-sortable-attach-image-item-inner'

  constructor (props) {
    super(props)
    this.getLinkHtml = this.getLinkHtml.bind(this)
    this.setImageClass = this.setImageClass.bind(this)

    this.state = { imgPortrait: true }
  }

  componentDidMount () {
    this.checkImageSize(this.props.imgUrl, this.setImageClass)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.checkImageSize(nextProps.imgUrl, this.setImageClass)
  }

  handleRemove (key) {
    this.props.handleRemove(key)
  }

  getLinkHtml (key) {
    return this.props.getUrlHtml(key)
  }

  checkImageSize (url, callback) {
    let img = new window.Image()
    img.onload = () => {
      let size = {
        width: img.width,
        height: img.height
      }
      callback(size)
    }
    img.src = url
  }

  setImageClass (size) {
    this.setState({
      imgPortrait: size.width < size.height
    })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const removeImage = localizations ? localizations.removeImage : 'Remove Image'
    let { className, url, oneMoreControl, indexValue, imgUrl } = this.props

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-has-link-value': url.link && url.link.url,
      'vcv-ui-form-attach-image-item-view--portrait': this.state.imgPortrait
    })

    return (
      <li className={className}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail'>
            <img src={imgUrl} />
          </figure>
          <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
            {oneMoreControl}
            <a className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
              onClick={this.handleRemove.bind(this, indexValue)}
              title={removeImage}
            >
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </a>
          </div>
        </div>
        {this.getLinkHtml(indexValue)}
      </li>
    )
  }
}
