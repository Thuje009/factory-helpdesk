'use client'

import { useState } from 'react'
import { createTicket } from '@/app/actions'
import { Machine } from '@/types/database'

interface CreateTicketFormProps {
  machines: Machine[] // รับรายชื่อเครื่องจักรมาจาก Server Component หลัก
}

export default function CreateTicketForm({ machines }: CreateTicketFormProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(false)

    const formData = new FormData(event.currentTarget)

    try {
      await createTicket(formData)
      setSuccessMsg(true);
      (event.target as HTMLFormElement).reset() // ล้างค่าฟอร์มหลังส่งสำเร็จ
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดบางอย่าง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">📝 แจ้งซ่อมเครื่องจักรใหม่</h3>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded text-sm border border-emerald-200">
          ✅ บันทึกใบแจ้งซ่อมเรียบร้อยแล้ว!
        </div>
      )}

      {/* เลือกเครื่องจักร */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">เลือกเครื่องจักร</label>
        <select
          name="machine_id"
          required
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">-- กรุณาเลือกเครื่องจักร --</option>
          {machines.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.machine_code} - {m.name} ({m.line_zone})
            </option>
          ))}
        </select>
      </div>

      {/* Error Code */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">รหัสข้อผิดพลาด (Error Code)</label>
        <input
          type="text"
          name="error_code"
          placeholder="เช่น ERR-CNC-01"
          required
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* ระดับความเร่งด่วน */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">ระดับความเร่งด่วน</label>
        <select
          name="priority"
          defaultValue="MEDIUM"
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="LOW">ต่ำ (Low)</option>
          <option value="MEDIUM">ปานกลาง (Medium)</option>
          <option value="HIGH">สูง (High)</option>
          <option value="URGENT">ด่วนที่สุด (Urgent)</option>
        </select>
      </div>

      {/* รายละเอียดปัญหา */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">รายละเอียดอาการเสีย</label>
        <textarea
          name="description"
          rows={3}
          placeholder="อธิบายอาการเบื้องต้น เช่น มอเตอร์ขัดข้อง มีเสียงดังผิดปกติ..."
          required
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 text-sm shadow-md"
      >
        {loading ? 'กำลังบันทึกข้อมูล...' : '📤 ส่งใบแจ้งซ่อม'}
      </button>
    </form>
  )
}