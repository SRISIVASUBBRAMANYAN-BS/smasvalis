import type { PrescriptionData, MedicineStock, SystemStatusData, VerificationResult } from "./types"

// Mock prescription data
const mockPrescription: PrescriptionData = {
  id: "RX-2023-05678",
  patientName: "Rahul Sharma",
  patientId: "ABHA-1234-5678",
  doctorName: "Dr. Priya Patel",
  hospitalName: "City General Hospital",
  date: "2023-03-21",
  medicines: [
    {
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 10,
      barcode: "MED-PARA-500-001",
    },
    {
      name: "Amoxicillin",
      dosage: "250mg",
      quantity: 15,
      barcode: "MED-AMOX-250-002",
    },
    {
      name: "Cetirizine",
      dosage: "10mg",
      quantity: 5,
      barcode: "MED-CETI-010-003",
    },
  ],
}

// Mock medicine stock data
const mockStock: MedicineStock[] = [
  {
    name: "Paracetamol 500mg",
    stockLevel: 85,
    expiryDate: "2024-12-31",
    batchNumber: "BATCH-001",
  },
  {
    name: "Amoxicillin 250mg",
    stockLevel: 42,
    expiryDate: "2024-06-30",
    batchNumber: "BATCH-002",
  },
  {
    name: "Cetirizine 10mg",
    stockLevel: 15,
    expiryDate: "2024-09-15",
    batchNumber: "BATCH-003",
  },
  {
    name: "Ibuprofen 400mg",
    stockLevel: 68,
    expiryDate: "2024-10-20",
    batchNumber: "BATCH-004",
  },
  {
    name: "Omeprazole 20mg",
    stockLevel: 92,
    expiryDate: "2025-01-15",
    batchNumber: "BATCH-005",
  },
  {
    name: "Metformin 500mg",
    stockLevel: 7,
    expiryDate: "2024-08-10",
    batchNumber: "BATCH-006",
  },
  {
    name: "Atorvastatin 10mg",
    stockLevel: 54,
    expiryDate: "2024-11-05",
    batchNumber: "BATCH-007",
  },
]

// Mock system status data
const mockSystemStatus: SystemStatusData = {
  network: {
    connected: true,
    signalStrength: 87,
    ipAddress: "192.168.1.105",
    lastSync: "2023-03-21 14:32:15",
  },
  hardware: {
    temperature: 42,
    cpuUsage: 23,
    storageUsed: "12.4 GB",
    storageTotal: "32 GB",
  },
  dispensers: [
    {
      id: 1,
      status: "operational",
      lastMaintenance: "2023-02-15",
    },
    {
      id: 2,
      status: "operational",
      lastMaintenance: "2023-02-15",
    },
    {
      id: 3,
      status: "warning",
      lastMaintenance: "2023-01-10",
    },
    {
      id: 4,
      status: "operational",
      lastMaintenance: "2023-02-28",
    },
  ],
  logs: [
    {
      timestamp: "2023-03-21 14:35:22",
      level: "info",
      message: "System startup complete",
    },
    {
      timestamp: "2023-03-21 14:36:05",
      level: "info",
      message: "Connected to network",
    },
    {
      timestamp: "2023-03-21 14:40:12",
      level: "info",
      message: "Stock data synchronized",
    },
    {
      timestamp: "2023-03-21 14:45:30",
      level: "warning",
      message: "Dispenser 3 requires calibration",
    },
    {
      timestamp: "2023-03-21 14:50:18",
      level: "info",
      message: "Prescription RX-2023-05677 processed",
    },
    {
      timestamp: "2023-03-21 14:55:42",
      level: "error",
      message: "Failed to connect to eSanjeevani API",
    },
    {
      timestamp: "2023-03-21 15:00:03",
      level: "info",
      message: "eSanjeevani API connection restored",
    },
  ],
}

// Mock QR code scanning function
export const mockScanQrCode = async (): Promise<PrescriptionData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrescription)
    }, 1500)
  })
}

// Mock medicine verification function
export const verifyMedicine = async (medicines: PrescriptionData["medicines"]): Promise<VerificationResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = medicines.map((medicine) => ({
        medicine,
        verified: Math.random() > 0.1, // 90% chance of verification success
        message: Math.random() > 0.1 ? "Medicine verified successfully" : "Verification failed - potential counterfeit",
      }))
      resolve(results)
    }, 2000)
  })
}

// Mock stock data function
export const getMedicineStock = async (): Promise<MedicineStock[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStock)
    }, 1000)
  })
}

// Mock system status function
export const getSystemStatus = async (): Promise<SystemStatusData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockSystemStatus,
        hardware: {
          ...mockSystemStatus.hardware,
          temperature: Math.floor(Math.random() * 10) + 38, // Random temperature between 38-47
          cpuUsage: Math.floor(Math.random() * 40) + 10, // Random CPU usage between 10-50%
        },
      })
    }, 800)
  })
}

