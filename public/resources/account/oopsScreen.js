import React from 'react'
import VCVLogo from './vcvLogo'
import PropTypes from 'prop-types'

const localizations = window.VCV_I18N && window.VCV_I18N()
const Errors = {
  default: {
    message: (localizations && localizations.feOopsMessageDefault) || 'It seems that something went wrong with loading content. Please make sure you are loading correct content and try again.',
    buttonText: (localizations && localizations.feOopsButtonTextDefault) || 'Return to WordPress dashboard',
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  },
  page_for_posts: {
    message: (localizations && localizations.feOopsMessagePageForPosts) || 'It seems you are trying to edit archive page which displays your post archive instead of content. Before edit, please make sure to convert it to a static page via your WordPress admin',
    buttonText: (localizations && localizations.feOopsButtonTextPageForPosts) || 'Return to WordPress dashboard',
    buttonLink: window.location.href.replace(/&vcv-action=frontend.*/i, '')
  },
  activation: {
    message: (localizations && localizations.activationFailed) || 'Your activation request failed. Please try again.'
  }
}

export default class OopsScreen extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    errorName: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.screenContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.screenContent.current && this.screenContent.current.classList.add('vcv-screen-content--active')
    }, 0)
  }

  getErrorMessage () {
    const { errorName, errorMessage } = this.props
    let errorText = errorMessage

    if (!errorText && errorName && Errors.hasOwnProperty(errorName)) {
      errorText = Errors[ errorName ].message
    }

    return errorText
  }

  clickButton () {
    if (this.state.buttonLink) {
      window.location = this.state.buttonLink
    }
  }

  getActionButtons () {
    const { errorName, errorAction, errorReportAction } = this.props
    if (Errors.hasOwnProperty(errorName) && Errors[ errorName ].buttonText) {
      return (
        <button
          className='vcv-screen-button'
          onClick={() => { window.location = Errors[ errorName ].buttonLink }}>
          {Errors[ errorName ].buttonText}
        </button>
      )
    } else {
      return <React.Fragment>
        {errorAction && (
          <button onClick={errorAction} className='vcv-screen-button'>
            Try Again
          </button>
        )}
        {errorReportAction && (
          <button onClick={errorReportAction} className='vcv-screen-button vcv-screen-button--dark'>
            Send error report
          </button>
        )}
      </React.Fragment>
    }
  }

  render () {
    const { errorAction, errorReportAction } = this.props
    return (
      <div className='vcv-error-screen vcv-screen-content' ref={this.screenContent}>
        <VCVLogo />
        <p className='vcv-screen-text'>Oops</p>
        <p className='vcv-screen-helper-text'>
          {this.getErrorMessage()}
        </p>
        <div className='vcv-screen-button-container'>
          {this.getActionButtons()}
        </div>
      </div>
    )
  }
}
