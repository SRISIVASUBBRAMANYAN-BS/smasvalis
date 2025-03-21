"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { QrScanner } from "@/components/qr-scanner"
import { MedicineDispenser } from "@/components/medicine-dispenser"
import { StockMonitor } from "@/components/stock-monitor"
import { CounterfeitDetection } from "@/components/counterfeit-detection"
import { SystemStatus } from "@/components/system-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PrescriptionData } from "@/lib/types"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("dispense")
  const [currentPrescription, setCurrentPrescription] = useState<PrescriptionData | null>(null)
  const [dispensingStatus, setDispensingStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")

  const handleQrScanned = (data: PrescriptionData) => {
    setCurrentPrescription(data)
    setDispensingStatus("idle")
  }

  const handleDispense = async () => {
    if (!currentPrescription) return

    setDispensingStatus("processing")

    try {
      // In a real implementation, this would communicate with the hardware
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setDispensingStatus("complete")
    } catch (error) {
      console.error("Dispensing error:", error)
      setDispensingStatus("error")
    }
  }

  const handleReset = () => {
    setCurrentPrescription(null)
    setDispensingStatus("idle")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Smart Medicine Automated System</h2>
        </div>

        <Tabs defaultValue="dispense" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="dispense">Dispense Medicine</TabsTrigger>
            <TabsTrigger value="stock">Stock Monitor</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="dispense" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Prescription Scanner</CardTitle>
                  <CardDescription>Scan QR code from digital prescription</CardDescription>
                </CardHeader>
                <CardContent>
                  <QrScanner onScan={handleQrScanned} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Counterfeit Detection</CardTitle>
                  <CardDescription>AI-powered medicine verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <CounterfeitDetection prescription={currentPrescription} />
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Medicine Dispenser</CardTitle>
                  <CardDescription>Automated dispensing system</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicineDispenser
                    prescription={currentPrescription}
                    status={dispensingStatus}
                    onDispense={handleDispense}
                    onReset={handleReset}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medicine Stock Monitor</CardTitle>
                <CardDescription>Real-time inventory tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <StockMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Hardware and connectivity monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <SystemStatus />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <footer className="border-t py-4 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DECCAANOW CORP. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">Smart Medicine Automated System v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}

