import { Provider } from "react-redux"
import { fixedCostStore } from "../state/FixedCostStore"

export const FixedCostProvider = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={fixedCostStore}>{children}</Provider>
}