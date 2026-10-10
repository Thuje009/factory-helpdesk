export interface SparePart {
  name: string
  unit_price: number
  unit: string
}

export interface TicketSparePart {
  quantity_used: number
  spare_parts: SparePart | null
}

export interface Machine {
  id?: number
  machine_code: string
  name: string
  line_zone: string
}

export type MaintenanceTicket = {
  id: number
  error_code: string
  description: string
  priority: string
  status: string
  downtime_minutes: number
  created_at: string
  machines: Machine // <-- กำหนดเป็น Object เดี่ยว (ไม่ต้องมี [])
  ticket_spare_parts?: any[]
}