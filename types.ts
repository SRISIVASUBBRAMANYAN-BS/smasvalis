export interface Medicine {
  name: string
  dosage: string
  quantity: number
  barcode: string
}

export interface PrescriptionData {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  hospitalName: string
  date: string
  medicines: Medicine[]
}

export interface MedicineStock {
  name: string
  stockLevel: number
  expiryDate: string
  batchNumber: string
}

export interface SystemStatusData {
  network: {
    connected: boolean
    signalStrength: number
    ipAddress: string
    lastSync: string
  }
  hardware: {
    temperature: number
    cpuUsage: number
    storageUsed: string
    storageTotal: string
  }
  dispensers: Array<{
    id: number
    status: "operational" | "warning" | "error"
    lastMaintenance: string
  }>
  logs: Array<{
    timestamp: string
    level: "info" | "warning" | "error"
    message: string
  }>
}

export interface VerificationResult {
  medicine: Medicine
  verified: boolean
  message: string
}

