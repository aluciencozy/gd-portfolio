import { useState, type CSSProperties, type ReactElement } from 'react'

interface SceneAssetProps {
  src: string
  alt: string
  className: string
  fallbackLabel: string
  dataAttribute?: string
  style?: CSSProperties
}

export function SceneAsset({
  src,
  alt,
  className,
  fallbackLabel,
  dataAttribute,
  style,
}: SceneAssetProps): ReactElement {
  const [failed, setFailed] = useState(false)
  const dataProps = dataAttribute
    ? { [`data-transition-${dataAttribute}`]: 'true' }
    : {}

  if (failed) {
    return (
      <div
        aria-hidden={alt === ''}
        className={`${className} block aspect-square rounded-md border border-white/20 bg-white/10 shadow-inner shadow-white/10`}
        data-asset-fallback={fallbackLabel}
        style={style}
        {...dataProps}
      />
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      src={src}
      style={style}
      {...dataProps}
    />
  )
}
