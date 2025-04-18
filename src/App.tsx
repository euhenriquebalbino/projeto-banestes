import { useState, useEffect } from 'react';
import { fetchAllData } from './api/fetchData';
import { Cliente, Conta, Agencia } from './types/interfaces';
import ClienteList from './components/ClienteList';
import ClienteDetail from './components/ClienteDetail';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './App.css';

// Componente ThemeToggle
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        // Ícone de lua (tema escuro)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        // Ícone de sol (tema claro)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
};

// Componente principal do aplicativo
function AppContent() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { clientes, contas, agencias } = await fetchAllData();
        setClientes(clientes);
        setContas(contas);
        setAgencias(agencias);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleBack = () => {
    setSelectedCliente(null);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <h2>Carregando dados...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Sistema Bancário</h1>
        <ThemeToggle />
      </header>
      
      <main>
        {selectedCliente ? (
          <ClienteDetail 
            cliente={selectedCliente} 
            contas={contas.filter(conta => conta.cpfCnpjCliente === selectedCliente.cpfCnpj)} 
            agencia={agencias.find(agencia => agencia.codigo === selectedCliente.codigoAgencia)}
            onBack={handleBack} 
          />
        ) : (
          <ClienteList 
            clientes={clientes} 
            onSelectCliente={handleSelectCliente} 
          />
        )}
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} - Sistema Bancário</p>
      </footer>
    </div>
  );
}

// Componente App com ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;