import { useState, type ReactElement } from 'react'
import { assetCatalog, type AssetEntry } from '../assets/asset-catalog'

const CATEGORY_LABELS = {
  character: 'Characters',
  portal: 'Portals',
  obstacle: 'Obstacles',
  background: 'Backgrounds',
} as const

function AssetPreview({ asset }: { asset: AssetEntry }): ReactElement {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        aria-label={`${asset.label} unavailable`}
        className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/30 bg-black/20 p-3 text-center text-[0.65rem] font-semibold tracking-[0.12em] text-white/55 uppercase"
        role="img"
      >
        Asset unavailable
      </div>
    )
  }

  return (
    <img
      alt=""
      className="aspect-square w-full rounded-xl bg-white/8 object-contain p-3 transition duration-200 group-hover:scale-105"
      onError={() => setFailed(true)}
      src={asset.src}
    />
  )
}

export function AssetGallery(): ReactElement {
  return (
    <div
      className="max-h-[31svh] overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-black/25 p-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-4"
      data-scene-scroll-exempt="true"
      tabIndex={0}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {assetCatalog.map((asset) => (
          <figure
            className="group min-w-0 rounded-xl border border-white/10 bg-white/5 p-2"
            key={asset.id}
          >
            <AssetPreview asset={asset} />
            <figcaption className="mt-2 text-[0.62rem] leading-tight font-semibold tracking-[0.08em] text-white/70 uppercase">
              <span className="block truncate">{asset.label}</span>
              <span className="mt-1 block text-[0.55rem] text-white/40">
                {CATEGORY_LABELS[asset.category]}
                {asset.fallback ? ' - temporary fallback' : ''}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
