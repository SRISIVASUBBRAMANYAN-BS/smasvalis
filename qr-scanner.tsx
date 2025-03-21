"use client"

import { useState, useRef } from "react"
import { Camera, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { PrescriptionData } from "@/lib/types"
import { mockScanQrCode } from "@/lib/mock-api"

interface QrScannerProps {
  onScan: (data: PrescriptionData) => void
}

export function QrScanner({ onScan }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startScanner = async () => {
    setError(null)
    setIsScanning(true)

    try {
      // In a real implementation, this would access the camera
      // For this demo, we'll simulate scanning after a delay
      setTimeout(() => {
        mockScanQrCode()
          .then((data) => {
            onScan(data)
            setIsScanning(false)
          })
          .catch((err) => {
            setError("Failed to scan QR code. Please try again.")
            setIsScanning(false)
          })
      }, 2000)
    } catch (err) {
      setError("Could not access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    setIsScanning(false)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {isScanning ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-primary/20 animate-scan"></div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">QR scanner ready</p>
          </div>
        )}
        <video ref={videoRef} className="w-full h-full object-cover hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        {isScanning ? (
          <Button variant="outline" onClick={stopScanner}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Cancel Scan
          </Button>
        ) : (
          <Button onClick={startScanner}>
            <Camera className="mr-2 h-4 w-4" />
            Scan Prescription
          </Button>
        )}
      </div>
    </div>
  )
}

