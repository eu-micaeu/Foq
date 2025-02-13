import React from 'react';
import { AuthProvider } from './context/AuthContext'; 
import Header from './components/Header/Header';
import MainContent from './components/Main/Main';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Header />
      <MainContent />
    </AuthProvider>
  );
}

export default App;