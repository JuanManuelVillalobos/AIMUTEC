// components/document-card.tsx
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, X, FileText, Download, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Document } from "@/types/document"

interface DocumentCardProps {
  document: Document
  onApprove: (id: string) => Promise<void>
  onDeny: (id: string) => Promise<void>
}

export function DocumentCard({ document, onApprove, onDeny }: DocumentCardProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleAction = async (action: 'approve' | 'deny') => {
    setIsLoading(action)
    try {
      if (action === 'approve') {
        await onApprove(document.id) // Call onApprove with the document id
      } else {
        await onDeny(document.id) // Call onDeny with the document id
      }
    } catch (error) {
      console.error(`Failed to ${action} document:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'denied':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{document.name}</CardTitle>
              <CardDescription>
                Uploaded by {document.uploadedBy} on{" "}
                {format(new Date(document.uploadedAt), "MMM d, yyyy")}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`${getStatusColor(document.status)} text-white capitalize`}
          >
            {document.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-0 text-sm">
          <div className="flex justify-between">
          </div>
          <div className="flex justify-left">
            <span className="text-muted-foreground">Tamaño:</span>
            <span className="font-medium">{formatFileSize(document.size)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(document.fileUrl, '_blank')}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </Button>
        {document.status === 'pending' && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction('deny')}
              disabled={isLoading !== null}
            >
              {isLoading === 'deny' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Denegar
            </Button>
            <Button
              size="sm"
              onClick={() => handleAction('approve')}
              disabled={isLoading !== null}
            >
              {isLoading === 'approve' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Aprobar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
