import { useState, useEffect } from "react";
import { fetchAllData } from "./api/fetchData";
import { Cliente, Conta, Agencia } from "./types/interfaces";
import ClienteList from "./components/ClienteList";
import ClienteDetail from "./components/ClienteDetail";
import "./App.css";

function App() {
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
        setError("Erro ao carregar dados. Por favor, tente novamente.");
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
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Sistema Bancário - Projeto Banestes</h1>
      </header>

      <main>
        {selectedCliente ? (
          <ClienteDetail
            cliente={selectedCliente}
            contas={contas.filter(
              (conta) => conta.cpfCnpjCliente === selectedCliente.cpfCnpj
            )}
            agencia={agencias.find(
              (agencia) => agencia.codigo === selectedCliente.codigoAgencia
            )}
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

export default App;
