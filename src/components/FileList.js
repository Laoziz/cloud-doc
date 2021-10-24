import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../hooks/useKeyPress';
import useContextMenu from '../hooks/useContextMenu';
import {getParentNode} from '../utils/helper'
const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState('');
  const enterPress = useKeyPress(13)
  const escPress = useKeyPress(27)
  const closeInput = (file) => {
    setEditStatus(false)
    setValue('')
    if (file.isNew){
      onFileDelete(file.id)
    }
  }
  const clickItem = useContextMenu([
    {
      label: '打开',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item');
        if (!!parentElement) {
          onFileClick(parentElement.dataset.id);
        }
      }
    },
    {
      label: '重命名',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item');
        if (!!parentElement) {
          setValue(parentElement.dataset.title);
          setEditStatus(parentElement.dataset.id);
        }
      }
    },
    {
      label: '删除',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item');
        if (!!parentElement) {
          console.log('id', parentElement.dataset.id);
          onFileDelete(parentElement.dataset.id);
        }
      }
    }
  ], '.file-list', [files]);
  useEffect(() => {
    const file = files.find(file => file.id === editStatus)
    if (enterPress && editStatus && value.trim() !== '') {
      onSaveEdit(file.id, value, file.isNew)
      setEditStatus(false)
      setValue('')
    } else if (escPress && editStatus) {
      closeInput(file)
    }
  }, [enterPress, escPress])
  useEffect(() => {
    const newFile = files.find(file => !!file.isNew)
    if (!!newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li
            className="list-group-item bg-ligth row d-flex align-items-center file-item"
            key={file.id}
            data-id={file.id}
            data-title={file.title}
          >
            { (editStatus !== file.id) && !file.isNew &&  // no input 
              <>  
                <span className="col-2">
                  <FontAwesomeIcon
                    size='lg'
                    icon={faMarkdown}
                  />
                </span>
                <span 
                  className="col-6 c-link"
                  onClick={() => {onFileClick(file.id)}}
                >
                  {file.title}
                </span>
                <button
                  type="button"
                  className="icon-btn col-2"
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
                  className="icon-btn col-2"
                  onClick={() => {onFileDelete(file.id)}}
                >
                  <FontAwesomeIcon
                    title="删除"
                    size='lg'
                    icon={faTrash}
                  />
                </button>
              </> 
            }
            {((editStatus === file.id) || !!file.isNew) && // input
              <>
                <input
                  className="from-control col-10"
                  value={value}
                  placeholder="请输入标题"
                  onChange={(e) => {setValue(e.target.value)}}
                >
                </input>
                <button 
                  type="button"
                  className="icon-btn col-2"
                  onClick={() => closeInput(file)}
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