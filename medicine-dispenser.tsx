"use client"

import { Pill, Package, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PrescriptionData } from "@/lib/types"

interface MedicineDispenserProps {
  prescription: PrescriptionData | null
  status: "idle" | "processing" | "complete" | "error"
  onDispense: () => void
  onReset: () => void
}

export function MedicineDispenser({ prescription, status, onDispense, onReset }: MedicineDispenserProps) {
  const isDisabled = !prescription || status === "processing"

  return (
    <div className="space-y-4">
      {prescription ? (
        <>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Prescription Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient:</span>
                <span>{prescription.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor:</span>
                <span>{prescription.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{prescription.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prescription ID:</span>
                <span>{prescription.id}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Medicines to Dispense</h3>
            {prescription.medicines.map((medicine, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-primary" />
                    <span>{medicine.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {medicine.dosage} × {medicine.quantity}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {status === "complete" ? (
              <>
                <div className="bg-green-500/10 text-green-500 p-3 rounded-lg text-center mb-2">
                  Medicines dispensed successfully!
                </div>
                <Button onClick={onReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              </>
            ) : status === "error" ? (
              <>
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-center mb-2">
                  Error dispensing medicines. Please try again.
                </div>
                <Button onClick={onReset} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={onDispense}>
                  <Package className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </>
            ) : (
              <Button onClick={onDispense} disabled={isDisabled}>
                {status === "processing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dispensing...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Dispense Medicines
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-center text-muted-foreground">Scan a prescription QR code to dispense medicines</p>
        </div>
      )}
    </div>
  )
}

