import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageLoad: (base64: string, fileName: string) => void
}

export function ImageUploader({ onImageLoad }: ImageUploaderProps) {
  const onDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onImageLoad(reader.result as string, file.name)
    }
    reader.readAsDataURL(file)
  }, [onImageLoad])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <ImageIcon size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 智能改图</h2>
          <p className="text-gray-500">上传一张图片，AI 将自动识别并拆分为可编辑的图层</p>
        </div>

        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-purple-400 bg-purple-50 scale-[1.02]'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload
            size={40}
            className={`mx-auto mb-4 ${isDragActive ? 'text-purple-500' : 'text-gray-400'}`}
          />
          {isDragActive ? (
            <p className="text-purple-600 font-medium">松开鼠标，上传图片</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium mb-1">拖拽图片到这里，或点击选择</p>
              <p className="text-sm text-gray-400">支持 PNG、JPG、JPEG、WebP 格式</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
