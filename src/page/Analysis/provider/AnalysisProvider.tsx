import { Provider } from "react-redux";
import { analysisStore } from "../state/AnalysisStore";

export const AnalysisProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={analysisStore}>{children}</Provider>
}