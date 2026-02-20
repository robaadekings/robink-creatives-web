import {BrowserRouter, Routes, Route} from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout"
import Landing from "../pages/public/Landing"

export default function AppRoutes() {
    return(
        <BrowserRouter>

        <Routes>
            <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />}>
            </Route>
        
            </Route>
        </Routes>
        </BrowserRouter>
    )
}