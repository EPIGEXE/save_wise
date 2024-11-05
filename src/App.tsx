import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './page/Layout/Layout';
import SettingPage from './page/Setting/SettingPage';
import CalendarPage from './page/Calendar/CalendarPage';
import { AnalysisRoute } from './page/Analysis/provider/AnalysisRoute';
import FixedCostPage from './page/FixedCost/FixedCostPage';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}>
          <Route index element={<CalendarPage isCollapsed={isCollapsed} />} />
          <Route path="/analysis" element={<AnalysisRoute />} />
          <Route path="/fixedcost" element={<FixedCostPage />} />
          <Route path="/setting" element={<SettingPage isCollapsed={isCollapsed} />} />
          {/* <Route index element={<YearlyEmission isCollapsed={isCollapsed} />} />
          <Route path="/compareEmission" element={<CompareEmission isCollapsed={isCollapsed} />} />
          <Route path="/regionEmission" element={<RegionEmission isCollapsed={isCollapsed} />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
