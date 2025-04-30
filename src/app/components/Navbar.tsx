import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
type Props = {}

export default function Navbar({}: Props) {
  return (
    <div className='flex justify-center mt-12 items-start md:items-center flex-col gap-2'>
      <p className='text-[#AEB4C1] text-sm'>Welcome to...</p>
    {/* <Link href={"/"}><Image src={"/images/connext.png"} alt='' width={250} height={0}/></Link> */}
    <p className='uppercase text-6xl font-bold title text-left md:text-center'>beyond <br/>limits</p>
    <p className='text-xl subTitle  font-bold '>RoV tournament ss3</p>
    </div>
  )
}