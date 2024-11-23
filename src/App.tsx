import { useEffect, useState } from 'react'
import './App.css'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './page/Layout/Layout';
import SettingPage from './page/Setting/SettingPage';
import CalendarPage from './page/Calendar/CalendarPage';
import AnalysisPage from './page/Analysis/AnalysisPage';
import FixedCostPage from './page/FixedCost/FixedCostPage';
import { appStore } from './store/AppStore';
import { Provider } from 'react-redux';
import GoalPage from './page/Goal/Goalpage';
import { resetColorCache } from './utils/Utils';

// AppRoutes 컴포넌트를 새로 만들어서 라우팅 로직 분리
function AppRoutes() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    resetColorCache();
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}>
        <Route index element={<CalendarPage isCollapsed={isCollapsed} />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/fixedcost" element={<FixedCostPage />} />
        <Route path="/goal" element={<GoalPage />} />
        <Route path="/setting" element={<SettingPage isCollapsed={isCollapsed} />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </Provider>
  )
}

export default App