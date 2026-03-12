import { Mic } from 'lucide-react'
import React from 'react'

const InterviewHeader = () => {
  return (
    <div className='p-4 shadow-sm'>
  <span className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
    <Mic className="h-7 w-7 text-blue-600" />
    <span className="text-blue-500">Vox</span>
    <span className="text-black">Hire</span>
  </span>
</div>
  )
}

export default InterviewHeader