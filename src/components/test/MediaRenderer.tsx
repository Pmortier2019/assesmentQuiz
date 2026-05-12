import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

interface MediaRendererProps {
  items: MediaItem[];
  className?: string;
}

function TableRenderer({ data }: { data: { headers: string[]; rows: string[][] } }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            {data.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold text-[#475569] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri} className={cn("border-b border-[#f1f5f9]", ri % 2 === 0 ? "bg-white" : "bg-[#fafafa]")}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-[#334155]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartRenderer({ data }: { data: { labels: string[]; datasets: { label: string; values: number[] }[] } }) {
  const maxVal = Math.max(...data.datasets.flatMap((d) => d.values));
  const colors = ["bg-[#4f46e5]", "bg-[#7c3aed]", "bg-[#2563eb]", "bg-[#10b981]"];

  return (
    <div className="rounded-xl border border-[#e2e8f0] p-4 bg-[#fafafa]">
      <div className="flex items-end gap-3 h-40">
        {data.labels.map((label, li) => (
          <div key={li} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col justify-end gap-1" style={{ height: "120px" }}>
              {data.datasets.map((ds, di) => (
                <div
                  key={di}
                  className={cn("w-full rounded-t-md opacity-90", colors[di % colors.length])}
                  style={{ height: `${(ds.values[li] / maxVal) * 100}px` }}
                  title={`${ds.label}: ${ds.values[li]}`}
                />
              ))}
            </div>
            <span className="text-xs text-[#64748b] text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
      {/* Legend */}
      {data.datasets.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#e2e8f0]">
          {data.datasets.map((ds, di) => (
            <div key={di} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", colors[di % colors.length])} />
              <span className="text-xs text-[#64748b]">{ds.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaRenderer({ items, className }: MediaRendererProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          {item.type === "IMAGE" && item.url && (
            <div className="relative w-full max-h-64 rounded-xl overflow-hidden border border-[#e2e8f0]">
              <Image
                src={item.url}
                alt={item.altText ?? "Question image"}
                width={640}
                height={256}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {item.type === "DIAGRAM" && item.url && (
            <div className="relative w-full rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#fafafa] p-4">
              <Image
                src={item.url}
                alt={item.altText ?? "Diagram"}
                width={640}
                height={320}
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {item.type === "TABLE" && item.tableData && (
            <TableRenderer data={item.tableData} />
          )}

          {item.type === "CHART" && item.chartData && (
            <ChartRenderer data={item.chartData} />
          )}

          {item.caption && (
            <p className="text-xs text-[#94a3b8] text-center italic">{item.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}
