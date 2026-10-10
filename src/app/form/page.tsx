import { createClient } from '@supabase/supabase-js'
import TicketCard from '@/components/TicketCard'
import CreateTicketForm from '@/components/CreateTicketForm'
import { MaintenanceTicket, Machine } from '@/types/database'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function FactoryDashboard() {
  // 1. ดึงข้อมูลตั๋วแจ้งซ่อม (ย้ายเข้ามาไว้ข้างในฟังก์ชันแล้ว)
  const { data: rawTickets, error: ticketError } = await supabase
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
    .order('id', { ascending: false })

  // 💡 บังคับแปลง Type ตรงนี้ ให้เป็น MaintenanceTicket[]
  const tickets = rawTickets as MaintenanceTicket[] | null

  // 2. ดึงข้อมูลเครื่องจักรทั้งหมดสำหรับใช้ในฟอร์มแจ้งซ่อม
  const { data: machines, error: machineError } = await supabase
    .from('machines')
    .select('id, machine_code, name, line_zone')
    .order('machine_code', { ascending: true })

  if (ticketError || machineError) {
    return (
      <div className="p-8 text-red-500 font-mono max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-2">⚠️ เกิดข้อผิดพลาดในการดึงข้อมูลจาก Supabase:</h2>
        <p className="bg-red-50 p-4 border border-red-200 rounded">
          {ticketError?.message || machineError?.message}
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            🏭 Smart Factory Helpdesk Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ระบบติดตามสถานะการแจ้งซ่อมและเบิกใช้อะไหล่แบบเรียลไทม์
          </p>
        </div>

        {/* Layout แบ่ง 2 คอลัมน์ (ซ้าย: ฟอร์มแจ้งซ่อม | ขวา: รายการแจ้งซ่อม) */}
        <div className="">
          {/* คอลัมน์ซ้าย: ฟอร์มแจ้งซ่อมใหม่ */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 text-gray-500">
              <CreateTicketForm machines={machines || []} />
            </div>
          </div>

          {/* คอลัมน์ขวา: รายการตั๋วแจ้งซ่อมทั้งหมด */}
          {/* <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
              <span>📋 รายการแจ้งซ่อมทั้งหมด</span>
              <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                {tickets?.length || 0} รายการ
              </span>
            </h2>

            {tickets && tickets.length > 0 ? (
              tickets.map((ticket: MaintenanceTicket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500">
                ยังไม่มีรายการแจ้งซ่อมในระบบ
              </div>
            )}
          </div> */}
        </div>
      </div>
    </main>
  )
}