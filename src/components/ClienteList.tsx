import { useState, useEffect } from "react";
import { Cliente } from "../types/interfaces";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";

interface ClienteListProps {
  clientes: Cliente[];
  onSelectCliente: (cliente: Cliente) => void;
}

const ClienteList: React.FC<ClienteListProps> = ({
  clientes,
  onSelectCliente,
}) => {
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>(clientes);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    filterClientes();
  }, [searchTerm, clientes]);

  const filterClientes = () => {
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const normalized = searchTerm.toLowerCase().trim();
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(normalized) ||
        cliente.cpfCnpj
          .replace(/\D/g, "")
          .includes(normalized.replace(/\D/g, ""))
    );

    setFilteredClientes(filtered);
    setCurrentPage(1); // Reset para primeira página quando filtrar
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  // Formatar CPF/CNPJ para exibição
  const formatCpfCnpj = (cpfCnpj: string) => {
    cpfCnpj = cpfCnpj.replace(/\D/g, "");
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return cpfCnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="cliente-list-container">
      <h2>Lista de Clientes</h2>

      <SearchFilter
        searchTerm={searchTerm}
        onSearch={handleSearch}
        placeholder="Buscar por nome ou CPF/CNPJ..."
      />

      {filteredClientes.length === 0 ? (
        <div className="no-results">
          <p>Nenhum cliente encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <>
          <div className="cliente-table-container">
            <table className="cliente-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Email</th>
                  <th>Patrimônio</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nomeSocial || cliente.nome}</td>
                    <td>{formatCpfCnpj(cliente.cpfCnpj)}</td>
                    <td>{cliente.email}</td>
                    <td>{formatCurrency(cliente.patrimonio)}</td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => onSelectCliente(cliente)}
                        aria-label={`Ver detalhes de ${cliente.nome}`}
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="results-info">
            <p>
              Exibindo {currentClientes.length} de {filteredClientes.length}{" "}
              clientes
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ClienteList;
