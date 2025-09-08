import { View, Canvas } from '@react-pdf/renderer';
import type { Watermark as WatermarkType } from '@/lib/constants';

type WatermarkProps = {
  watermark?: WatermarkType;
};

export function Watermark({ watermark }: WatermarkProps) {
  if (!watermark || !watermark.enabled) return null;

  const paint = (painter: any, availableWidth: number, availableHeight: number): null => {
    const text = (watermark.text || 'MARCA AGUA').toUpperCase();
    const size = watermark.size || 40;
    const color = watermark.color || '#64748b';
    const opacity = watermark.opacity || 0.2;
    const rotation = watermark.rotation || -45;

    painter.fillColor(color).opacity(opacity).fontSize(size);

    const pageWidth = availableWidth;
    const pageHeight = availableHeight;

    const gapX = size * 6;
    const gapY = size * 6;

    const rows = Math.ceil(pageHeight / gapY);
    const cols = Math.ceil(pageWidth / gapX);

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        painter.save();

        const x = c * gapX + gapX / 2;
        const y = r * gapY + gapY / 2;

        painter.translate(x, y);
        painter.rotate(rotation);

        painter.text(`${text}   `, 0, 0, { align: 'left', baseline: 'middle' });
        painter.restore();
      }
    }

    return null;
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      fixed
    >
      <Canvas paint={paint} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}
