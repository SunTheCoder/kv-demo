export type DimensionUnit = 'in' | 'cm' | 'ft' | 'yd' | 'm'

export interface Dimensions {
  width: number
  height: number
  depth?: number
  unit: DimensionUnit
}

export function formatDimensions(dimensions: Dimensions): string {
  const { width, height, depth, unit } = dimensions
  return depth 
    ? `${width}×${height}×${depth}${unit}`
    : `${width}×${height}${unit}`
}

export function parseDimensions(dimensionString: string): Dimensions | null {
  try {
    const match = dimensionString.match(/^(\d+)×(\d+)(?:×(\d+))?([a-z]+)$/)
    if (!match) return null
    
    const [_, width, height, depth, unit] = match
    return {
      width: Number(width),
      height: Number(height),
      ...(depth ? { depth: Number(depth) } : {}),
      unit: unit as DimensionUnit
    }
  } catch {
    return null
  }
} 