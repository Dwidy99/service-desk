import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
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
import { useSelector } from 'react-redux'

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth)

  if (!user) return <Navigate to='/login' />
  if (user.role !== 'admin') return <Navigate to='/' />

  return children
}

function App() {
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
      </div>
    </Router>
  )
}

export default App
