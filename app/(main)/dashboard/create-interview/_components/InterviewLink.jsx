import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Copy, Link2, List, Mail, Plus } from 'lucide-react'
import { FaSlack, FaWhatsapp } from "react-icons/fa"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const InterviewLink = ({ interview_id, formData }) => {
  const url = process.env.NEXT_PUBLIC_HOST_URL + `/` + interview_id;

  const GenerateInterviewUrl = () => {
    
    return url;
  }

  const onCopyLink = async() => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied to Clipboard");
  }
  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <Image 
        src={'/check.png'} 
        alt='check' 
        width={200} 
        height={200} 
        className='w-[50px] h-[50px]'
      />

      <h2 className='font-bold text-lg mt-4'>
        Your AI Interview is Ready!
      </h2>

      <p className='mt-3'>
        Share this link to your candidates to start the interview process
      </p>

      <div className='w-full p-7 mt-6 rounded-lg bg-white'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold'>Interview Link</h2>
          <h2 className='p-1 px-2 text-primary bg-blue-50 rounded'>
            Valid for 30 Days
          </h2>
        </div>

        <div className='mt-3 flex gap-3 items-center'>
          <Input defaultValue={GenerateInterviewUrl()} disabled />
          <Button onClick={()=>onCopyLink()}>
            <Copy /> Copy Link
          </Button>
        </div>

        <hr className='my-7'/>

        <div className='flex gap-5'>
          <h2 className='text-xs text-gray-500 flex gap-2 items-center'>
            <Clock className='h-4 w-4'/> {formData?.duration}
          </h2>

          <h2 className='text-xs text-gray-500 flex gap-2 items-center'>
            <List className='h-4 w-4'/> 10 Questions
          </h2>
        </div>
      </div>

      <div className='mt-7 bg-white p-5 rounded-lg w-full'>
  <h2 className='font-bold'>Share Via</h2>

  <div className='flex gap-4 mt-2 w-full'>
    <Button variant='outline' className='flex-1'>
      <Mail className='mr-2' /> Email
    </Button>

    <Button variant='outline' className='flex-1'>
      <FaSlack className='mr-2' /> Slack
    </Button>

    <Button variant='outline' className='flex-1'>
      <FaWhatsapp className='mr-2' /> Whatsapp
    </Button>
  </div>
</div>

      <div className='flex w-full gap-5 justify-between mt-6'>
        <Link href={'/dashboard'} >
        <Button variant='outline'>
          <ArrowLeft className='h-4 w-4 mr-2'/> Back to Dashboard
        </Button>
        </Link>
        <Link href={'/create-interview'} >
        <Button>
          <Plus className='h-4 w-4 mr-2'/> Add New Interview
        </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewLink