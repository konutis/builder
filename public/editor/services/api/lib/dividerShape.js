import React from 'react'
const { Component, PropTypes } = React
let shapes = require('./shapes')

export default class DividerShape extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    fill: PropTypes.string,
    shape: PropTypes.string,
    fillType: PropTypes.string,
    backgroundImage: PropTypes.string,
    id: PropTypes.string,
    flipHorizontally: PropTypes.bool,
    deviceKey: PropTypes.string
  }

  getLinearGradient () {
    if (this.props.fillType !== 'gradient') {
      return null
    }

    let startColor = this.props.gradientColorStart
    let endColor = this.props.gradientColorEnd

    if (this.props.flipHorizontally) {
      startColor = this.props.gradientColorEnd
      endColor = this.props.gradientColorStart
    }

    let id = `gradient-${this.props.id}-${this.props.deviceKey}`
    return (
      <linearGradient id={id} x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' style={{ stopColor: startColor, stopOpacity: '1' }} />
        <stop offset='100%' style={{ stopColor: endColor, stopOpacity: '1' }} />
      </linearGradient>
    )
  }

  changeHeight (height, svgContent) {
    let parser = new window.DOMParser()
    let doc = parser.parseFromString(svgContent, 'text/html')
    height = parseFloat(height)
    let paths = doc.querySelectorAll('path')
    paths = [].slice.call(paths)
    paths.forEach((path) => {
      let d = path.getAttribute('d')
      let commands = d.split(/(?=[LMCZ])/)
      commands.pop()

      let pointArrays = commands.map((d) => {
        let letter = d[ 0 ]
        let pointsArray = d.slice(1, d.length).split(' ')
        let points = []
        pointsArray.forEach((item) => {
          if (item !== '') {
            let coordinates = item.split(',')
            let newX = parseFloat(coordinates[ 1 ])
            if (newX !== 0) {
              newX = newX + height
            }
            points.push(coordinates[ 0 ] + ',' + newX)
          }
        })
        return letter + points.join(' ')
      })
      path.setAttribute('d', `${pointArrays.join(' ')} Z`)
    })
    return doc.body && doc.body.innerHTML
  }

  render () {
    let { width, height, fill, shape, fillType, backgroundImage, deviceKey, id } = this.props
    let currentShape = shapes[ shape ]

    if (!currentShape) {
      return null
    }

    let svgContent = currentShape.content
    let svgUnitContent = currentShape.unitContent
    let viewBoxWidth = currentShape.viewBox.width
    let viewBoxHeight = currentShape.viewBox.height
    let viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`

    if (fillType === 'color' || fillType === 'gradient' || !backgroundImage) {
      let html = this.changeHeight(height, svgContent)
      let customAttributes = {}
      customAttributes.fill = fill

      if (fillType === 'gradient') {
        let gradientId = `gradient-${id}-${deviceKey}`
        customAttributes.fill = `url(#${gradientId})`
      }

      return (
        <svg viewBox={viewBox} width={width} height={viewBoxHeight} preserveAspectRatio='none'>
          {this.getLinearGradient()}
          <g {...customAttributes} dangerouslySetInnerHTML={{ __html: html }} />
        </svg>
      )
    }

    if (fillType === 'image') {
      let imageId = `image-el-${id}-${deviceKey}`
      let html = svgUnitContent
      let backgroundImageUrl = `url(${backgroundImage})`
      let imageProps = {}

      imageProps.style = {
        height: `${parseFloat(height)}px`,
        width: width
      }

      let percentage = width.replace('%', '')
      let backgroundProps = {}

      backgroundProps.style = {
        width: `${100 / percentage * 100}%`,
        backgroundImage: backgroundImageUrl
      }

      return (
        <div className='vce-divider-with-image'>
          <svg>
            <clipPath id={imageId} dangerouslySetInnerHTML={{ __html: html }} clipPathUnits='objectBoundingBox' />
          </svg>
          <div {...imageProps} className='vce-divider-image-block'>
            <div {...backgroundProps} className='vce-divider-image-background-block' />
          </div>
        </div>
      )
    }
  }
}
