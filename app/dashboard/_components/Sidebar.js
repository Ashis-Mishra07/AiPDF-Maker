"use client"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress';
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Sidebar() {
  const { user } = useUser();
  const path = usePathname();
  const fileList = useQuery(api.fileStorage.getUsersFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="shadow-md h-screen p-7 ">
      <Image src={"/logo.svg"} width={170} height={120} alt="logo" />

      <div className="mt-10">
        <UploadPdfDialog isMaxFile={fileList?.length >= 20 ? true : false}>
          <Button className="w-full ">+ Upload PDFs</Button>
        </UploadPdfDialog>
        <Link href={'/dashboard'}>
          <div
            className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard" && "bg-slate-200"}`}>
            <Layout />
            <h2>WorkSpace</h2>
          </div>
        </Link>
        <Link href={'/dashboard/upgrade'}>
          <div
            className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${path == "/dashboard/upgrade" && "bg-slate-200"}`}>
            <Shield />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>
      <div className="absolute bottom-24 w-[80%] ">
        <Progress value={(fileList?.length / 20) * 100} />
        <p className="text-sm mt-1 ">
          {fileList?.length} out of 20 PDFs Uploaded
        </p>
        <p className="text-sm text-gray-400 mt-1 ">Upgrade to Upload more</p>
      </div>
    </div>
  );
}

export default Sidebar