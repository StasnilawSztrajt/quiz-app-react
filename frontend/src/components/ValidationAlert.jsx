import React from 'react'

const ValidationAlert = ({
  validationText
}) =>{
  return(
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute top-3/4" role="alert">
      <strong className="font-bold">{validationText}</strong>
    </div>
  )
}

export default ValidationAlert;