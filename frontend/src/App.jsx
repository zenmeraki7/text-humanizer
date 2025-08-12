
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/SignUp'
import ForgotPasswordPage from './pages/Auth/ForgetPassword'
import NotFoundPage from './pages/NotFound'
import ResetPasswordPage from './pages/Auth/ResetPassword'
import SettingsPage from './pages/Settings'
import MainLayout from './pages/Layout/MainLayout'
import PricingPage from './pages/Pricing'
import AIDetectorContent from './components/Detector'
import PlagiarismRemover from './components/Plagiarism'

function App() {

  return (
    <>
      <Routes>
         <Route path="/login" element={<LoginPage/>} />
        <Route path='/sign-up' element={<SignupPage/>}/>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>
        <Route path="*" element={<NotFoundPage/>} />
        <Route element={<MainLayout/>}>
        <Route path="/" element={<Homepage />} />
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/pricing' element={<PricingPage/>}/>
        <Route path='/detector' element={<AIDetectorContent/>} />
        <Route path='/plagiarism' element={<PlagiarismRemover/>} />
      </Route>
      </Routes>
    </>
  )
}

export default App
