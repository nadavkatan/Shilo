import { DotSpinner } from '@uiball/loaders'
import React from 'react'

const Spinner = () => {
  return (
    <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ margin: "15em" }}>
            <DotSpinner 
            color="#FBCB0A"
            size={100}
             />
          </div>
        </div> 
  )
}

export default Spinner