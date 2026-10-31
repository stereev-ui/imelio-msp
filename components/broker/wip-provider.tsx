'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createSeedMilestones, toIsoDate, type Milestone } from '@/lib/broker-data'

type WipContextValue = {
  milestones: Milestone[]
  selectedDate: string
  setSelectedDate: (iso: string) => void
  toggleMilestone: (id: string) => void
  addMilestone: (milestone: Omit<Milestone, 'id' | 'done'>) => void
  removeMilestone: (id: string) => void
}

const WipContext = createContext<WipContextValue | null>(null)

export function WipProvider({ children }: { children: React.ReactNode }) {
  const [milestones, setMilestones] = useState<Milestone[]>(createSeedMilestones)
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()))

  const toggleMilestone = useCallback((id: string) => {
    setMilestones((list) => list.map((m) => (m.id === id ? { ...m, done: !m.done } : m)))
  }, [])

  const addMilestone = useCallback((milestone: Omit<Milestone, 'id' | 'done'>) => {
    setMilestones((list) => [...list, { ...milestone, id: `M-${Date.now()}`, done: false }])
  }, [])

  const removeMilestone = useCallback((id: string) => {
    setMilestones((list) => list.filter((m) => m.id !== id))
  }, [])

  const value = useMemo(
    () => ({ milestones, selectedDate, setSelectedDate, toggleMilestone, addMilestone, removeMilestone }),
    [milestones, selectedDate, toggleMilestone, addMilestone, removeMilestone],
  )

  return <WipContext.Provider value={value}>{children}</WipContext.Provider>
}

export function useWip() {
  const context = useContext(WipContext)
  if (!context) throw new Error('useWip must be used within WipProvider')
  return context
}
