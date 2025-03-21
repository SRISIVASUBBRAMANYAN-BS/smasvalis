"use client"

import { useState, useEffect } from "react"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getMedicineStock } from "@/lib/mock-api"
import type { MedicineStock } from "@/lib/types"

export function StockMonitor() {
  const [stock, setStock] = useState<MedicineStock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStock = async () => {
    setIsLoading(true)
    try {
      const data = await getMedicineStock()
      setStock(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch stock:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStock()
  }, [])

  const filteredStock = stock.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStockStatus = (level: number) => {
    if (level < 20) return "low"
    if (level < 50) return "medium"
    return "high"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="outline" size="sm" onClick={fetchStock} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</p>}

      <div className="space-y-2">
        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-5 w-1/3 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-full bg-muted rounded-sm"></div>
                </CardContent>
              </Card>
            ))
        ) : filteredStock.length > 0 ? (
          filteredStock.map((item, index) => {
            const status = getStockStatus(item.stockLevel)
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <Badge variant={status === "low" ? "destructive" : status === "medium" ? "default" : "outline"}>
                      {status === "low" ? "Low Stock" : status === "medium" ? "Medium" : "In Stock"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock Level:</span>
                      <span>{item.stockLevel}%</span>
                    </div>
                    <Progress
                      value={item.stockLevel}
                      className={`h-2 ${
                        status === "low"
                          ? "bg-destructive/20"
                          : status === "medium"
                            ? "bg-yellow-500/20"
                            : "bg-green-500/20"
                      }`}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expiry:</span>
                      <span>{item.expiryDate}</span>
                    </div>
                    {item.stockLevel < 20 && (
                      <div className="flex items-center text-xs text-destructive mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Reorder required
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
            <p className="text-center text-muted-foreground">No medicines found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

