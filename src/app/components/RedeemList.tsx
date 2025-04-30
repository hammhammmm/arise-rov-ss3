import { UserInfoEPassport } from '@/types/index'
import React from 'react'
import RedeemItem from './RedeemItem';

type Props = {
  userInfo: UserInfoEPassport
  refresh: () => void;

}

export default function RedeemList({userInfo,refresh}: Props) {
  if(userInfo.detail.size == null || userInfo.detail.size == ""){
    return  <></>
  }
  return (
    <div className="w-full  bg-blue-600/80 rounded-lg py-8 px-4">
    <p className="text-3xl mb-4 text-center text-white uppercase glow bold">
      COLLECT YOUR T-SHIRT
    </p>
    <p className="text-white text-2xl italic bold text-center">
      SIZE: {userInfo.detail.size}
    </p>
    {(userInfo.detail.size != null && userInfo.detail.size != "") ? (
       <div className="mt-8 relative flex justify-center items-center flex-col">
       {(!userInfo.checkin.is_redeem) ? (
         <>
           <RedeemItem refresh={refresh} size={String(userInfo.detail.size)} />
           <p className="text-sm text-white italic mt-2 bg-black/40 text-center p-4 rounded-lg w-full">
             * Please show this to the staff, and they will redeem it.
           </p>
         </>
       ) : (
         <p className="italic text-xl text-white/40 bg-black/40 text-center p-4 rounded-lg w-full">
           Redeemed
         </p>
       )}
     </div>
    ):(
      <><p className="text-sm text-white italic mt-2 bg-black/40 text-center p-4 rounded-lg w-full">
      * Please contact the staff to collect your t-shirt.
    </p></>
    )}
   
  </div>
  )
}