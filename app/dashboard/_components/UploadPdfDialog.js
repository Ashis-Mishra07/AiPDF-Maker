"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2Icon } from 'lucide-react';
import { v4 as uuidv4 } from "uuid";
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

function UploadPdfDialog({children}) {

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
    const {user}=useUser();
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest);
    const [file,setFile]=useState();
    const [loading,setLoading]=useState(false);
    const [fileName,setFileName]=useState();
    const [open,setOpen]=useState(false);

    const OnFileSelect = (event) =>{
        setFile(event.target.files[0]);
    }
    const OnUpload = async () =>{
      setLoading(true);

      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
      console.log('Storage Id',storageId);
      const fileId = uuidv4();
      const fileUrl = await getFileUrl({ storageId:storageId });

      const resp=await addFileEntry({
        fileId,
        storageId,
        fileName:fileName??'Untitled File' ,
        fileUrl:fileUrl,
        createdBy:user?.primaryEmailAddress?.emailAddress
      })

      console.log(resp);

      const ApiResp = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
      console.log(ApiResp.data.result);   
      await embeddDocument({
        splitText:ApiResp.data.result,
        fileId:fileId
      });  
      
      setLoading(false);
      setOpen(false);
      
    }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={()=>setOpen(true)} className="w-full" >+ Upload PDF File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uplaod PDF File</DialogTitle>
          <DialogDescription asChild>
            <div className="">
              <h2 className="mt-5">Select a File to Upload</h2>
              <div className="gap-2 p-3 rounded-md border">
                <input type="file" accept='application/pdf' onChange={(event)=>OnFileSelect(event)}/>
              </div>
              <div className="mt-2 ">
                <label>File Name*</label>
                <Input placeholder="File Name" onChange={(e)=>setFileName(e.target.value)} />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?<Loader2Icon className='animate-spin'/>:'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPdfDialog