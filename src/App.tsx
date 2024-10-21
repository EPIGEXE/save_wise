import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './page/Layout/Layout';
import TestPage from './components/test/TestPage';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}>
          <Route index element={<TestPage isCollapsed={isCollapsed} />} />
          {/* <Route index element={<YearlyEmission isCollapsed={isCollapsed} />} />
          <Route path="/compareEmission" element={<CompareEmission isCollapsed={isCollapsed} />} />
          <Route path="/regionEmission" element={<RegionEmission isCollapsed={isCollapsed} />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
