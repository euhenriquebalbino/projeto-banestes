import React from "react";
import { Cliente, Conta, Agencia } from "../types/interfaces";

interface ClienteDetailProps {
  cliente: Cliente;
  contas: Conta[];
  agencia?: Agencia;
  onBack: () => void;
}

const ClienteDetail: React.FC<ClienteDetailProps> = ({
  cliente,
  contas,
  agencia,
  onBack,
}) => {
  // Formatar CPF/CNPJ
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

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  return (
    <div className="cliente-detail">
      <div className="detail-header">
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Voltar para lista de clientes"
        >
          &larr; Voltar
        </button>
        <h2>{cliente.nomeSocial || cliente.nome}</h2>
      </div>

      <div className="detail-sections">
        {/* Seção de informações pessoais */}
        <section className="info-section">
          <h3>Informações Pessoais</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nome Completo:</span>
              <span className="info-value">{cliente.nome}</span>
            </div>

            {cliente.nomeSocial && (
              <div className="info-item">
                <span className="info-label">Nome Social:</span>
                <span className="info-value">{cliente.nomeSocial}</span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">CPF/CNPJ:</span>
              <span className="info-value">
                {formatCpfCnpj(cliente.cpfCnpj)}
              </span>
            </div>

            {cliente.rg && (
              <div className="info-item">
                <span className="info-label">RG:</span>
                <span className="info-value">{cliente.rg}</span>
              </div>
            )}

            <div className="info-item">
              <span className="info-label">Data de Nascimento:</span>
              <span className="info-value">
                {formatDate(cliente.dataNascimento)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{cliente.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Endereço:</span>
              <span className="info-value">{cliente.endereco}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Estado Civil:</span>
              <span className="info-value">{cliente.estadoCivil}</span>
            </div>
          </div>
        </section>

        {/* Seção financeira */}
        <section className="info-section">
          <h3>Informações Financeiras</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Renda Anual:</span>
              <span className="info-value">
                {formatCurrency(cliente.rendaAnual)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Patrimônio:</span>
              <span className="info-value">
                {formatCurrency(cliente.patrimonio)}
              </span>
            </div>
          </div>
        </section>

        {/* Seção de contas */}
        <section className="info-section">
          <h3>Contas Bancárias</h3>
          {contas.length === 0 ? (
            <p className="no-data">
              Nenhuma conta encontrada para este cliente.
            </p>
          ) : (
            <div className="contas-container">
              {contas.map((conta) => (
                <div key={conta.id} className="conta-card">
                  <h4>
                    Conta {conta.tipo === "corrente" ? "Corrente" : "Poupança"}
                  </h4>
                  <div className="conta-info">
                    <div className="info-item">
                      <span className="info-label">ID:</span>
                      <span className="info-value">{conta.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Saldo:</span>
                      <span className="info-value">
                        {formatCurrency(conta.saldo)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Limite de Crédito:</span>
                      <span className="info-value">
                        {formatCurrency(conta.limiteCredito)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Crédito Disponível:</span>
                      <span className="info-value">
                        {formatCurrency(conta.creditoDisponivel)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção de agência */}
        <section className="info-section">
          <h3>Agência</h3>
          {agencia ? (
            <div className="agencia-info">
              <div className="info-item">
                <span className="info-label">Nome:</span>
                <span className="info-value">{agencia.nome}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Código:</span>
                <span className="info-value">{agencia.codigo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Endereço:</span>
                <span className="info-value">{agencia.endereco}</span>
              </div>
            </div>
          ) : (
            <p className="no-data">Informações da agência não encontradas.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClienteDetail;
