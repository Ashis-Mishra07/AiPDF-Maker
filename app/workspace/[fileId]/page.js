"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';

function Workspace() {
    const { fileId } = useParams();

  return (
    <div>
        <WorkspaceHeader />
    </div>
  )
}

export default Workspace