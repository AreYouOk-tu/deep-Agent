interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ src, alt, fallback = '?', size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0`}>
      {fallback}
    </div>
  )
}
