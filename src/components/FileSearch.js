import {useState, useEffect, useRef} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
const FileSearch = ({title, onFileSearch}) => {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const node = useRef(null)
  const closeInput = () => {
    setInputActive(false)
    setValue('')
  }
  const enterPress = useKeyPress(13)
  const escPress = useKeyPress(27)
  useEffect(() => {
    if (enterPress && inputActive) {
      onFileSearch(value)
      closeInput()
    } else if (escPress && inputActive) {
      closeInput()
    }
  })
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive])
  return (
    <div className="alter alter-primary d-flex justify-content-between align-items-center mb-0">
      {
        !inputActive ? (
          <>
            <span className="">
              {title}
            </span>
            <button 
              type="button"
              className="icon-btn"
              onClick={() => {setInputActive(true)}}
              >
              <FontAwesomeIcon
               icon={faSearch}
               size="lg"
               title="搜索"
              />
            </button>
          </>
        ) : (
          <>
            <input 
              className="from-control"
              value={value}
              ref={node}
              onChange={(e) => {setValue(e.target.value)}}
            >
            </input>
            <button 
              type="button"
              className="icon-btn"
              onClick={closeInput}
              >
              <FontAwesomeIcon
               icon={faTimes}
               size="lg"
               title="关闭"
              />
            </button>
          </>
        )
      }
    </div>
  )
}

FileSearch.prototype = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: "My Document"
}
export default FileSearch