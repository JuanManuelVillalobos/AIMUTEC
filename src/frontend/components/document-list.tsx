// components/document-list.tsx
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState, useEffect } from "react"
import { DocumentCard } from "./document-card"
import { Loader2 } from 'lucide-react'
import { fetchPinnedFiles } from '../lib/pinata'
import { Document } from '../types/document'

import { createActor } from '../../declarations/backend';
import { useSearchParams } from 'next/navigation';
import { ActorSubclass } from '@dfinity/agent'
import { _SERVICE } from '../../declarations/backend/backend.did'

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]) 
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams();
  const canisterIdParam = searchParams.get('canisterId');

  const canisterId = canisterIdParam || process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND;

  let backendActor: ActorSubclass<_SERVICE>;
  if (canisterId) {
    backendActor = createActor(canisterId);
  } else {
    console.error('Canister ID not found');
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)  // Reset error state

      const response = await fetchPinnedFiles()

      if (!response || !response.rows || response.rows.length === 0) {
        setError('No pinned documents found.')
        return
      }

      // Process the documents if the response is valid
      const documentsWithFullData = await Promise.all(
        response.rows.map(async (file: any) => {
          const metadata = file.metadata || {}
          const name = metadata.name || 'Unnamed File'
          const size = metadata.size || file.size
          const mime_type = metadata.mime_type || 'Unknown Type'
          const uploadedAt = file.date_pinned || new Date().toISOString()

          // Default file URL
          const fileUrl = `https://gateway.pinata.cloud/ipfs/${file.ipfs_pin_hash}`

          const status = await backendActor.getStatus(file.id)


          return {
            id: file.id,
            name: name,
            fileUrl: fileUrl, 
            status: status, // Set status to 'pending' for demonstration
            type: mime_type,
            uploadedBy: file.user_id || 'Unknown User',
            uploadedAt: uploadedAt,
            size: size,
          }
        })
      )

      setDocuments(documentsWithFullData)
    } catch (error: any) {
      console.error("Failed to fetch documents:", error)
      setError('Error fetching documents from Pinata: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle approve action
  const handleApprove = async (id: string) => {
    await backendActor.approveDocument(id);
    // Update the document status after approval
    setDocuments(prevDocuments => prevDocuments.map(doc =>
      doc.id === id ? { ...doc, status: 'approved' } : doc
    ));

  }

  // Function to handle deny action
  const handleDeny = async (id: string) => {
    await backendActor.denyDocument(id);
    // Update the document status after denial
    setDocuments(prevDocuments => prevDocuments.map(doc =>
      doc.id === id ? { ...doc, status: 'denied' } : doc
    ));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {documents.length === 0 ? (
        <p>No documents available</p>
      ) : (
        documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onApprove={handleApprove}  // Pass onApprove to the DocumentCard
            onDeny={handleDeny}       // Pass onDeny to the DocumentCard
          />
        ))
      )}
    </div>
  )
}
