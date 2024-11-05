import FixedCostPage from "../FixedCostPage"
import { FixedCostProvider } from "./FixedCostProvider"

export const FixedCostRoute = () => {
    return (
        <FixedCostProvider>
            <FixedCostPage />
        </FixedCostProvider>
    )
}