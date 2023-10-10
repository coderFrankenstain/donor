import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const data = await request.formData()
  const file = data.get('file') 

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const myUUID = uuidv4();
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  const filename = myUUID + extension
  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  const path = `/app/upload/${filename}`
  await writeFile(path, buffer)
  console.log(`open ${filename} to see the uploaded file`)

  return NextResponse.json({ path: filename })
}