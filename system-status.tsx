"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi, Thermometer, Cpu, HardDrive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSystemStatus } from "@/lib/mock-api"
import type { SystemStatusData } from "@/lib/types"

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchStatus = async () => {
    setIsLoading(true)
    try {
      const data = await getSystemStatus()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!status) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {status.network.connected ? (
                <Wifi className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <WifiOff className="h-5 w-5 text-destructive mr-2" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{status.network.connected ? "Connected" : "Disconnected"}</span>
                  <span className="text-xs text-muted-foreground">{status.network.signalStrength}%</span>
                </div>
                <Progress value={status.network.signalStrength} className="h-1 mt-1" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {status.network.connected ? (
                <>
                  <div>IP: {status.network.ipAddress}</div>
                  <div>Last sync: {status.network.lastSync}</div>
                </>
              ) : (
                <div>Attempting to reconnect...</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hardware Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-orange-500" />
                <span className="text-sm">Temperature</span>
                <span className="ml-auto text-sm">{status.hardware.temperature}°C</span>
              </div>
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">CPU Usage</span>
                <span className="ml-auto text-sm">{status.hardware.cpuUsage}%</span>
              </div>
              <div className="flex items-center">
                <HardDrive className="h-4 w-4 mr-2 text-purple-500" />
                <span className="text-sm">Storage</span>
                <span className="ml-auto text-sm">
                  {status.hardware.storageUsed} / {status.hardware.storageTotal}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Dispenser Mechanism</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {status.dispensers.map((dispenser, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-2 ${
                    dispenser.status === "operational"
                      ? "bg-green-500"
                      : dispenser.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-destructive"
                  }`}
                />
                <span className="text-sm">Dispenser {index + 1}</span>
                <span className="ml-auto text-xs capitalize text-muted-foreground">{dispenser.status}</span>
              </div>
            ))}
          </div>

          {status.dispensers.some((d) => d.status !== "operational") && (
            <div className="mt-4 p-2 bg-yellow-500/10 text-yellow-500 rounded text-xs">
              Some dispensers require maintenance. Please contact technical support.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 overflow-y-auto bg-muted p-2 rounded text-xs font-mono">
            {status.logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-muted-foreground">[{log.timestamp}]</span>{" "}
                <span
                  className={`
                  ${log.level === "info" ? "text-blue-500" : ""}
                  ${log.level === "warning" ? "text-yellow-500" : ""}
                  ${log.level === "error" ? "text-destructive" : ""}
                `}
                >
                  {log.level.toUpperCase()}
                </span>
                : {log.message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

