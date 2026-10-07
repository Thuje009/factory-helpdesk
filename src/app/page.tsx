import { supabase } from '@/config/lib/supabase' // หรือ '@/lib/supabase' ขึ้นอยู่กับว่าเปลี่ยนชื่อโฟลเดอร์ไหม
import { MaintenanceTicket } from '@/types/database'
import TicketCard from '@/components/TicketCard'

export const dynamic = 'force-dynamic'

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
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </main>
  )
}