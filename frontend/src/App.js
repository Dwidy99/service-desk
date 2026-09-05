import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import AuthTransition from './components/AuthTransition'
import Home from './pages/Home'
import NewTicket from './pages/NewTicket'
import Tickets from './pages/Tickets'
import Ticket from './pages/Ticket'
import Members from './pages/Member'
import NewMember from './pages/NewMember'
import Departments from './pages/Department'
import NewDepartment from './pages/NewDepartment'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import PublicRoute from './components/PublicRoute'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthTransition } from './features/auth/authSlice'

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)

  if (!user) return <Navigate to='/login' />
  if (user.role !== 'admin') return <Navigate to='/' />

  return children
}

function App() {
  const dispatch = useDispatch()
  const { authTransition } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!authTransition) return

    const timeout = setTimeout(() => {
      dispatch(clearAuthTransition())
    }, 1100)

    return () => clearTimeout(timeout)
  }, [authTransition, dispatch])

  return (
    <Router>
      <div className='min-h-screen w-full bg-gray-50'>
        <Header />

        <Routes>
          <Route
            path='/'
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path='/new-ticket'
            element={
              <PrivateRoute>
                <NewTicket />
              </PrivateRoute>
            }
          />
          <Route
            path='/tickets'
            element={
              <PrivateRoute>
                <Tickets />
              </PrivateRoute>
            }
          />
          <Route
            path='/ticket/:ticketId'
            element={
              <PrivateRoute>
                <Ticket />
              </PrivateRoute>
            }
          />
          <Route
            path='/members'
            element={
              <AdminRoute>
                <Members />
              </AdminRoute>
            }
          />
          <Route
            path='/create-member'
            element={
              <AdminRoute>
                <NewMember />
              </AdminRoute>
            }
          />
          <Route
            path='/departments'
            element={
              <AdminRoute>
                <Departments />
              </AdminRoute>
            }
          />
          <Route
            path='/create-department'
            element={
              <AdminRoute>
                <NewDepartment />
              </AdminRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>

        <ToastContainer
          position='top-right'
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme='light'
        />

        {authTransition && <AuthTransition type={authTransition} />}
      </div>
    </Router>
  )
}

export default App
