'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// สร้าง Supabase Client สำหรับฝั่ง Server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function createTicket(formData: FormData) {
  const error_code = formData.get('error_code') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const machine_id = formData.get('machine_id') as string

  // ตรวจสอบข้อมูลเบื้องต้น
  if (!error_code || !description || !machine_id) {
    throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน')
  }

  // บันทึกลงตาราง maintenance_tickets ใน Supabase
  const { error } = await supabase.from('maintenance_tickets').insert([
    {
      error_code,
      description,
      priority: priority || 'MEDIUM',
      status: 'OPEN', // ค่าเริ่มต้นเมื่อแจ้งซ่อมใหม่
      machine_id: parseInt(machine_id),
      downtime_minutes: 0,
    },
  ])

  if (error) {
    throw new Error(`เกิดข้อผิดพลาดในการบันทึก: ${error.message}`)
  }

  // สั่งเคลียร์แคชและรีเฟรชหน้า Dashboard ให้แสดงข้อมูลใหม่ทันที
  revalidatePath('/')
}