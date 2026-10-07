import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TripList from './pages/TripList.jsx';
import CreateTrip from './pages/CreateTrip.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Personal from './pages/Personal.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login portal="manager" />} />
      <Route path="/member-login" element={<Login portal="member" />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/trips/:id" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/personal" element={<Personal />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
