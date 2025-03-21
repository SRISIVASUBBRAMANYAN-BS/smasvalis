"use client"

import { useState, useEffect } from "react"
import { Check, X, AlertTriangle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { PrescriptionData } from "@/lib/types"
import { verifyMedicine } from "@/lib/mock-api"

interface CounterfeitDetectionProps {
  prescription: PrescriptionData | null
}

export function CounterfeitDetection({ prescription }: CounterfeitDetectionProps) {
  const [status, setStatus] = useState<"idle" | "scanning" | "verified" | "counterfeit" | "unknown">("idle")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!prescription) {
      setStatus("idle")
      setProgress(0)
      return
    }

    setStatus("scanning")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate verification process
    verifyMedicine(prescription.medicines)
      .then((results) => {
        const allVerified = results.every((r) => r.verified)
        setStatus(allVerified ? "verified" : "counterfeit")
        clearInterval(interval)
        setProgress(100)
      })
      .catch(() => {
        setStatus("unknown")
        clearInterval(interval)
        setProgress(100)
      })

    return () => clearInterval(interval)
  }, [prescription])

  const renderStatusIcon = () => {
    switch (status) {
      case "idle":
        return <AlertTriangle className="h-12 w-12 text-muted-foreground" />
      case "scanning":
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />
      case "verified":
        return <Check className="h-12 w-12 text-green-500" />
      case "counterfeit":
        return <X className="h-12 w-12 text-destructive" />
      case "unknown":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />
    }
  }

  const renderStatusText = () => {
    switch (status) {
      case "idle":
        return "Waiting for prescription"
      case "scanning":
        return "Verifying medicine authenticity..."
      case "verified":
        return "All medicines verified"
      case "counterfeit":
        return "Potential counterfeit detected!"
      case "unknown":
        return "Verification failed"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
        {renderStatusIcon()}
        <p className="mt-2 text-center font-medium">{renderStatusText()}</p>

        {status === "scanning" && (
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {prescription && status !== "idle" && status !== "scanning" && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Verification Results:</h4>
          <ul className="space-y-1">
            {prescription.medicines.map((medicine, index) => (
              <li key={index} className="text-sm flex items-center">
                {status === "verified" ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : status === "counterfeit" ? (
                  <X className="h-4 w-4 text-destructive mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                )}
                {medicine.name} ({medicine.dosage})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

