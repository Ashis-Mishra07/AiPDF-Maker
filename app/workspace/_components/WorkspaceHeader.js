import Image from 'next/image'
import React from 'react'

function WorkspaceHeader() {
  return (
    <div>
        <Image src={'/logo.svg'} alt='logo' width={140} height={100}/>
    </div>
  )
}

export default WorkspaceHeader