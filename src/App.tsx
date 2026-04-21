import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { TheoryHubPage } from './pages/TheoryHubPage'
import { SimulationsPage } from './pages/SimulationsPage'
import { VirtualLabPage } from './pages/VirtualLabPage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { DataVisualizationPage } from './pages/DataVisualizationPage'
import { BatteryLabPage } from './pages/BatteryLabPage'
import { CorrosionPourbaixPage } from './pages/CorrosionPourbaixPage'
import { QuizPage } from './pages/QuizPage'
import { AIAssistantPage } from './pages/AIAssistantPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="theory" element={<TheoryHubPage />} />
        <Route path="simulations" element={<SimulationsPage />} />
        <Route path="virtual-lab" element={<VirtualLabPage />} />
        <Route path="calculators" element={<CalculatorsPage />} />
        <Route path="data-viz" element={<DataVisualizationPage />} />
        <Route path="battery-lab" element={<BatteryLabPage />} />
        <Route path="corrosion" element={<CorrosionPourbaixPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="assistant" element={<AIAssistantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
