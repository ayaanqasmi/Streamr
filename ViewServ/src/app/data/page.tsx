import { DataTableDemo } from "@/components/DataTable"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-slate-100">
      <div className="w-[70vw]">
        <DataTableDemo/>
      </div>
    </div>
  )
}
