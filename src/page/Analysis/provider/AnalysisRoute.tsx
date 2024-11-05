import AnalysisPage from "../AnalysisPage"
import { AnalysisProvider } from "./AnalysisProvider"

export const AnalysisRoute = () => {
    return (
        <AnalysisProvider>
            <AnalysisPage />
        </AnalysisProvider>
    )
}