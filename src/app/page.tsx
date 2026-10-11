import { createClient } from '@supabase/supabase-js'
import DashboardContent from '@/components/DashboardContent'
import { MaintenanceTicket } from '@/types/database'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function FactoryDashboard() {
  const { data: rawTickets } = await supabase
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

  const tickets = rawTickets as MaintenanceTicket[] | null

  const { data: machines } = await supabase
    .from('machines')
    .select('id, machine_code, name, line_zone')
    .order('machine_code', { ascending: true })

  return <DashboardContent tickets={tickets || []} machines={machines || []} />
}