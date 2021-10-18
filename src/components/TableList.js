import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import '../sass/TableList.scss';
const TableList = ({files, activeId, unSaveId, onTabClick, onCloseTab}) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {
        files.map(file => {
          const unSaveicon = unSaveId.includes(file.id);
          const fClassName = classNames({
            'nav-link': true,
            'active': file.id === activeId,
            'withUnsaved': unSaveicon
          })
          return (
            <li 
              className="nav item" 
              key={file.id}
              onClick={(e) => {e.preventDefault();onTabClick(file.id)}}
            >
              <a
                href="#"
                className={fClassName}
              >
                {file.title}
                <span 
                  className="ml-2 close-icon"
                  onClick={(e) => {e.stopPropagation();onCloseTab(file.id)}}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                  />
                </span>
                {unSaveicon && <span className="rounded-circle ml-2 unsave-icon"></span>}
              </a>
            </li>
          )
        })
      }
    </ul>
  )
}

TableList.prototype = {
  files: PropTypes.array, 
  activeId: PropTypes.number, 
  unSaveId: PropTypes.number, 
  onTabClick: PropTypes.func, 
  onCloseTab: PropTypes.func,
}

export default TableList;