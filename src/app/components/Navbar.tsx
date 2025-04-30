import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
type Props = {}

export default function Navbar({}: Props) {
  return (
    <div className='flex justify-center mt-12 items-center flex-col gap-2'>
    <Link href={"/"}><Image src={"/images/connext.png"} alt='' width={250} height={0}/></Link>
    </div>
  )
}