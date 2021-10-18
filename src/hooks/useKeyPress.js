import { useState, useEffect } from "react";

const useKeyPress = (keyPressCode) => {
  const [keyPress, setKeyPress] = useState(false)
  const keyUpHandler = ({keyCode}) => {
    if (keyPressCode === keyCode) 
      setKeyPress(false)
  }
  const keyDownHandler = ({keyCode}) => {
    if (keyPressCode === keyCode) 
      setKeyPress(true)
  }
  useEffect(() => {
    document.addEventListener('keyup', keyUpHandler)
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keyup', keyUpHandler)
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])
  return keyPress
}

export default useKeyPress