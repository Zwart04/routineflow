import { AuthGuard } from '@/components/AuthGuard'
import RoutineDetailContent from './RoutineDetailClient'

export default function RoutineDetailPage() {
  return (
    <AuthGuard>
      <RoutineDetailContent />
    </AuthGuard>
  )
}

export function generateStaticParams() {
  return [{ id: 'dummy' }]
}