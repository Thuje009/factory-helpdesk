import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface SparePart {
  name: string
  unit_price: number
  unit: string
}

interface TicketSparePart {
  quantity_used: number
  spare_parts: SparePart | null
}

interface Machine {
  machine_code: string
  name: string
  line_zone: string
}

interface MaintenanceTicket {
  id: number
  error_code: string
  description: string
  priority: string
  status: string
  downtime_minutes: number
  created_at: string
  machines: Machine | null
  ticket_spare_parts: TicketSparePart[]
}

export default async function FactoryDashboard() {
  const { data: tickets, error } = await supabase
    .from('maintenance_tickets')
    .select(`
      id,
      error_code,
      description,
      priority,
      status,
      downtime_minutes,
      created_at,
      machines (
        machine_code,
        name,
        line_zone
      ),
      ticket_spare_parts (
        quantity_used,
        spare_parts (
          name,
          unit_price,
          unit
        )
      )
    `)
    .order('id', { ascending: true })

  if (error) {
    return (
      <div className="p-8 text-red-500 font-mono max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-2">⚠️ เกิดข้อผิดพลาดในการดึงข้อมูลจาก Supabase:</h2>
        <p className="bg-red-50 p-4 border border-red-200 rounded">{error.message}</p>
      </div>
    )
  }

  const ticketList = (tickets || []) as unknown as MaintenanceTicket[]

  return (
    <main className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50 text-gray-800">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">⚙️ Smart Factory Maintenance Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">ระบบติดตามสถานะการแจ้งซ่อมและเบิกใช้อะไหล่</p>
      </header>

      <div className="grid gap-4">
        {ticketList.map((ticket) => (
          <div key={ticket.id} className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  Ticket #{ticket.id}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{ticket.error_code}</h2>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                ticket.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {ticket.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>

            {/* ข้อมูลเครื่องจักร */}
            {ticket.machines && (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-3">
                📍 <strong>เครื่องจักร:</strong> {ticket.machines.machine_code} - {ticket.machines.name} | <strong>โซน:</strong> {ticket.machines.line_zone}
              </div>
            )}

            {/* รายการอะไหล่ที่เบิกใช้ */}
            {ticket.ticket_spare_parts && ticket.ticket_spare_parts.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <p className="font-semibold text-xs text-gray-700 mb-2">🔧 อะไหล่ที่เบิกใช้:</p>
                <ul className="space-y-1">
                  {ticket.ticket_spare_parts.map((item, idx) => {
                    const part = item.spare_parts
                    const totalCost = item.quantity_used * (part?.unit_price || 0)
                    return (
                      <li key={idx} className="text-xs text-gray-600 flex justify-between bg-slate-50 px-3 py-1.5 rounded">
                        <span>{part?.name} ({item.quantity_used} {part?.unit})</span>
                        <span className="font-medium text-gray-700">{totalCost.toLocaleString()} บาท</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}