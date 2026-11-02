import { Suspense } from "react";
import ResearchSection from '@/components/research/ResearchSection'

export default function ResearchPage() {
  return (
    <main>
        <Suspense fallback={null}>
          <ResearchSection />
        </Suspense>
    </main>
  )
}
