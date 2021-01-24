import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import styled from "styled-components"

const StyledCustomCursor = styled.div`
  pointer-events: none;
  width: 50px;
  height: 50px;
  top: -25px;
  left: -25px;
  background-color: palevioletred;
  border-radius: 50%;
  position: absolute;
  mix-blend-mode: difference;
  z-index: 999;
  transform: translate(-100px, -100px);
`

const CustomCursor = () => {
  const customCursorRef = useRef(null)

  useEffect(() => {
    window.addEventListener("mousemove", e => {
      gsap.to(customCursorRef.current, {
        duration: 0.5,
        ease: "ease-in-out",
        x: e.clientX,
        y: e.clientY,
      })
    })
  }, [])
  return <StyledCustomCursor ref={customCursorRef}></StyledCustomCursor>
}

export default CustomCursor
