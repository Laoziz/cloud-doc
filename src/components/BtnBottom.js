import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const BtnBottom = ({ text, colorClass, icon, onClick}) => (
  <button
    type="button"
    className={`btn btn-block no-border no-padding ${colorClass} btn-bottom`}
    onClick={()=>{onClick()}}
  >
    <FontAwesomeIcon
      className="mr-2"
      icon={icon}
      size="lg"
      title={text}
    />
    {text}
  </button>
)

BtnBottom.prototype = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func
}
BtnBottom.defaultProps = {
  text: "新建"
}
export default BtnBottom