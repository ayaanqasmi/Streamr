import { UploadForm } from "@/components/UploadForm"

export default function EditForm({ formData }) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <UploadForm isEditMode={true} videoDetails={
                    formData
                } />
            </div>
        </div>
    )
}
