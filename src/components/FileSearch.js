import {useState, useEffect, useRef} from 'react'

const FileSearch = ({title, onFileSearch}) => {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const node = useRef(null)
  const closeInput = (e) => {
    e.preventDefault()
    setInputActive(false)
    setValue('')
  }
  useEffect(() => {
    const handInputEvent = (event) => {
      const {keyCode} = event
      if (keyCode === 13 && inputActive) {
        onFileSearch(value)
      } else if (keyCode === 27 && inputActive) {
        closeInput(event)
      }
    }
    document.addEventListener('keydown', handInputEvent)
    return () => {
      document.removeEventListener('keydown', handInputEvent)
    }
  })
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive])
  return (
    <div className="alter alter-primary">
      {
        !inputActive ? (
          <div className="d-flex justify-content-between align-items-center">
            <span className="">
              {title}
            </span>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => {setInputActive(true)}}
              >
              搜索
            </button>
          </div>
        ) : (
          <div className="row">
            <input 
              className="from-control col-8"
              value={value}
              ref={node}
              onChange={(e) => {setValue(e.target.value)}}
            >
            </input>
            <button 
              type="button"
              className="btn btn-primary col-4"
              onClick={closeInput}
              >
              关闭
            </button>
          </div>
        )
      }
    </div>
  )
}

export default FileSearch