import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../hooks/useKeyPress';
const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState('');
  const enterPress = useKeyPress(13)
  const escPress = useKeyPress(27)
  const closeInput = () => {
    setEditStatus(false)
    setValue('')
  }
  useEffect(() => {
    if (enterPress && editStatus) {
      const file = files.find(file => file.id == editStatus)
      onSaveEdit(file.id, value)
      closeInput()
    } else if (escPress && editStatus) {
      closeInput()
    }
  })
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li
            className="list-group-item bg-ligth row d-flex align-items-center file-item"
            key={file.id}
          >
            { (editStatus !== file.id) ?      
              <>  
                <span className="col-2">
                  <FontAwesomeIcon
                    size='lg'
                    icon={faMarkdown}
                  />
                </span>
                <span 
                  className="col-8 c-link"
                  onClick={() => {onFileClick(file.id)}}
                >
                  {file.title}
                </span>
                <button
                  type="button"
                  className="icon-btn col-1"
                  onClick={()=>{setValue(file.title); setEditStatus(file.id);}}
                >
                  <FontAwesomeIcon
                    title="编辑"
                    size='lg'
                    icon={faEdit}
                  />
                </button>
                <button
                  type="button"
                  className="icon-btn col-1"
                  onClick={() => {onFileDelete(file.id)}}
                >
                  <FontAwesomeIcon
                    title="删除"
                    size='lg'
                    icon={faTrash}
                  />
                </button>
              </> :
              <>
                <input 
                  className="from-control col-10"
                  value={value}
                  onChange={(e) => {setValue(e.target.value)}}
                >
                </input>
                <button 
                  type="button"
                  className="icon-btn col-2"
                  onClick={closeInput}
                  >
                  <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  title="关闭"
                  />
                </button>
              </>
            }
          </li>
        ))
      }
    </ul>
  );
}

FileList.prototype = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func, 
  onFileDelete: PropTypes.func,
}

FileList.defaultProps = {
  files: []
}
export default FileList;