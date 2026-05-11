import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { WorkoutVersion, Exercise } from '../../types'

const COLORS = ['#1D9E75', '#D85A30', '#9B59B6', '#E67E22', '#3B82F6', '#EF4444', '#F59E0B', '#10B981']

function calculateVolume(ex: Exercise): number {
  const repsNum = parseFloat(ex.reps) || 0
  if (ex.resistance.type === 'kg') return ex.sets * repsNum * (ex.resistance.value || 0)
  if (ex.resistance.type === 'band') {
    const scale: Record<string, number> = { red: 1, blue: 2, green: 3, black: 4, purple: 5 }
    return ex.sets * repsNum * (scale[ex.resistance.bandColor ?? 'red'] ?? 1)
  }
  return ex.sets * repsNum
}

interface ProgressChartProps {
  versions: WorkoutVersion[]
}

function toMs(d: Date | unknown): number {
  if (d instanceof Date) return d.getTime()
  const ts = d as any
  return ts?.seconds ? ts.seconds * 1000 : 0
}

export function ProgressChart({ versions }: ProgressChartProps) {
  const sortedVersions = useMemo(() =>
    [...versions].sort((a, b) => toMs(a.createdAt) - toMs(b.createdAt)),
    [versions])

  const exerciseNames = useMemo(() => {
    const names = new Set<string>()
    sortedVersions.forEach(v => v.exercises.forEach(ex => names.add(ex.name)))
    return Array.from(names)
  }, [sortedVersions])

  const [active, setActive] = useState<Set<string>>(new Set(exerciseNames.slice(0, 4)))

  const chartData = useMemo(() => sortedVersions.map(v => {
    const date = new Date(toMs(v.createdAt))
    const point: Record<string, any> = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    exerciseNames.forEach(name => {
      const ex = v.exercises.find(e => e.name === name)
      point[name] = ex ? calculateVolume(ex) : null
    })
    return point
  }), [sortedVersions, exerciseNames])

  const totalVolumeStart = useMemo(() => {
    if (!sortedVersions[0]) return 0
    return sortedVersions[0].exercises.reduce((s, e) => s + calculateVolume(e), 0)
  }, [sortedVersions])

  const totalVolumeEnd = useMemo(() => {
    const last = sortedVersions[sortedVersions.length - 1]
    if (!last) return 0
    return last.exercises.reduce((s, e) => s + calculateVolume(e), 0)
  }, [sortedVersions])

  const volumeChange = totalVolumeStart > 0
    ? Math.round(((totalVolumeEnd - totalVolumeStart) / totalVolumeStart) * 100)
    : 0

  const bestExercise = useMemo(() => {
    if (sortedVersions.length < 2) return null
    let best = { name: '', pct: 0 }
    exerciseNames.forEach(name => {
      const first = sortedVersions[0].exercises.find(e => e.name === name)
      const last = sortedVersions[sortedVersions.length - 1].exercises.find(e => e.name === name)
      if (first && last) {
        const v1 = calculateVolume(first)
        const v2 = calculateVolume(last)
        if (v1 > 0) {
          const pct = Math.round(((v2 - v1) / v1) * 100)
          if (pct > best.pct) best = { name, pct }
        }
      }
    })
    return best.name ? best : null
  }, [sortedVersions, exerciseNames])

  if (versions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No sessions logged yet
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm font-medium mb-1">Volume over time</p>
      <p className="text-xs text-gray-400 mb-4">per session · hover to see sets × reps × weight</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {exerciseNames.map((name, i) => {
          const color = COLORS[i % COLORS.length]
          const isActive = active.has(name)
          return (
            <button
              key={name}
              onClick={() => {
                setActive(prev => {
                  const next = new Set(prev)
                  next.has(name) ? next.delete(name) : next.add(name)
                  return next
                })
              }}
              className="text-xs px-3 py-1 rounded-full transition-opacity"
              style={{ background: isActive ? color : '#e5e7eb', color: isActive ? '#fff' : '#6b7280' }}
            >
              {name}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} label={{ value: 'Volume (kg·reps)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#aaa' } }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0e0e0' }}
            formatter={(value: any, nameArg: any, props: any) => {
              const exName = String(nameArg ?? '')
              const v = sortedVersions[props.index]
              const ex = v?.exercises.find(e => e.name === exName)
              if (!ex) return [value, exName]
              const w = ex.resistance.type === 'kg' ? `${ex.resistance.value} kg` : ex.resistance.type === 'band' ? `${ex.resistance.bandColor} band` : 'bodyweight'
              return [`${ex.sets} sets × ${ex.reps} reps × ${w}`, exName]
            }}
          />
          {exerciseNames.map((name, i) =>
            active.has(name) ? (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="bg-gray-50 rounded-lg p-3.5">
          <p className="text-xs text-gray-400 mb-1.5">Total volume</p>
          <p className="text-xl font-medium">{volumeChange >= 0 ? '+' : ''}{volumeChange}%</p>
          <p className="text-xs text-emerald-600 mt-1">since first session</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3.5">
          <p className="text-xs text-gray-400 mb-1.5">Sessions logged</p>
          <p className="text-xl font-medium">{sortedVersions.length}</p>
          <p className="text-xs text-gray-400 mt-1">total</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3.5">
          <p className="text-xs text-gray-400 mb-1.5">Best exercise</p>
          {bestExercise ? (
            <>
              <p className="text-lg font-medium truncate">{bestExercise.name}</p>
              <p className="text-xs text-emerald-600 mt-1">+{bestExercise.pct}% volume</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">—</p>
          )}
        </div>
      </div>
    </div>
  )
}
