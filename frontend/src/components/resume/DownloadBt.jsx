import React from 'react'
import { FiDownload } from 'react-icons/fi'
import {useReactToPrint} from "react-to-print"

const DownloadBt = ({docRef,user,setUser}) => {

  const handlePdf = useReactToPrint({
    contentRef:docRef,
    documentTitle:"FresherAIPDF"
  }) 

  const handleDownload = async () => {
    handlePdf()
  }

  return (
    <button onClick={handleDownload} className='flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs text-white'>
      <FiDownload/>
      Download PDF
    </button>
  )
}

export default DownloadBt