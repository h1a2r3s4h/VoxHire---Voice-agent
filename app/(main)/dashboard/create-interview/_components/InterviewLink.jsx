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

      <div className='w-full p-8 mt-8 rounded-2xl bg-card border border-white/5 shadow-lg shadow-black/50'>
        <div className='flex justify-between items-center'>
          <h2 className='font-bold text-foreground text-lg'>Interview Link</h2>
          <h2 className='p-1 px-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm font-medium'>
            Valid for 30 Days
          </h2>
        </div>

        <div className='mt-4 flex gap-3 items-center'>
          <Input defaultValue={GenerateInterviewUrl()} disabled className="bg-background border-white/10 opacity-100 font-mono text-sm text-blue-200" />
          <Button onClick={()=>onCopyLink()} className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all">
            <Copy className="h-4 w-4 mr-2" /> Copy Link
          </Button>
        </div>

        <hr className='my-7'/>

        <div className='flex gap-5'>
          <h2 className='text-xs text-muted-foreground flex gap-2 items-center'>
            <Clock className='h-4 w-4'/> {formData?.duration}
          </h2>

          <h2 className='text-xs text-muted-foreground flex gap-2 items-center'>
            <List className='h-4 w-4'/> 10 Questions
          </h2>
        </div>
      </div>

      <div className='mt-6 bg-card p-8 rounded-2xl border border-white/5 shadow-lg shadow-black/50 w-full'>
  <h2 className='font-bold text-lg text-foreground'>Share Via</h2>

  <div className='flex gap-4 mt-4 w-full'>
    <Button variant='outline' className='flex-1 border-white/10 hover:bg-white/5 hover:text-white transition-colors'>
      <Mail className='mr-2 h-4 w-4' /> Email
    </Button>

    <Button variant='outline' className='flex-1 border-white/10 hover:bg-white/5 hover:text-white transition-colors'>
      <FaSlack className='mr-2 h-4 w-4' /> Slack
    </Button>

    <Button className='flex-1 bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all hover:-translate-y-1'>
      <FaWhatsapp className='mr-2 h-4 w-4' /> Whatsapp
    </Button>
  </div>
</div>

      <div className='flex w-full gap-5 justify-between mt-6'>
        <Link href={'/dashboard'} >
        <Button variant='outline' className="border-white/10 hover:bg-white/5 transition-colors">
          <ArrowLeft className='h-4 w-4 mr-2'/> Back to Dashboard
        </Button>
        </Link>
        <Link href={'/create-interview'} >
        <Button className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02]">
          <Plus className='h-4 w-4 mr-2'/> Add New Interview
        </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewLink