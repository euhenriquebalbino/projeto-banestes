import { Cliente, Conta, Agencia } from "../types/interfaces";

const URLS = {
  clientes:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes",
  contas:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas",
  agencias:
    "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias",
};

// Função para fazer parsing de CSV para array de objetos
function parseCSV(csv: string): any[] {
  const lines = csv.split("\n");
  const headers = lines[0]
    .split(",")
    .map((header) => header.replace(/"/g, "").trim());

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      // Manipular corretamente strings com vírgulas dentro de aspas
      const values: string[] = [];
      let currentValue = "";
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue);

      // Remover aspas extras
      const cleanValues = values.map((val) => val.replace(/"/g, "").trim());

      // Criar objeto usando os headers
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = cleanValues[index];
      });

      return obj;
    });
}

// Função para converter os dados para o formato correto
function formatCliente(cliente: any): Cliente {
  return {
    id: cliente.id,
    cpfCnpj: cliente.cpfCnpj,
    rg: cliente.rg || undefined,
    dataNascimento: new Date(cliente.dataNascimento),
    nome: cliente.nome,
    nomeSocial: cliente.nomeSocial || undefined,
    email: cliente.email,
    endereco: cliente.endereco,
    rendaAnual: Number(cliente.rendaAnual),
    patrimonio: Number(cliente.patrimonio),
    estadoCivil: cliente.estadoCivil as
      | "Solteiro"
      | "Casado"
      | "Viúvo"
      | "Divorciado",
    codigoAgencia: Number(cliente.codigoAgencia),
  };
}

function formatConta(conta: any): Conta {
  return {
    id: conta.id,
    cpfCnpjCliente: conta.cpfCnpjCliente,
    tipo: conta.tipo as "corrente" | "poupanca",
    saldo: Number(conta.saldo),
    limiteCredito: Number(conta.limiteCredito),
    creditoDisponivel: Number(conta.creditoDisponivel),
  };
}

function formatAgencia(agencia: any): Agencia {
  return {
    id: agencia.id,
    codigo: Number(agencia.codigo),
    nome: agencia.nome,
    endereco: agencia.endereco,
  };
}

// Funções para buscar os dados
export async function fetchClientes(): Promise<Cliente[]> {
  try {
    const response = await fetch(URLS.clientes);
    const text = await response.text();
    const parsedData = parseCSV(text);
    return parsedData.map(formatCliente);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
}

export async function fetchContas(): Promise<Conta[]> {
  try {
    const response = await fetch(URLS.contas);
    const text = await response.text();
    const parsedData = parseCSV(text);
    return parsedData.map(formatConta);
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return [];
  }
}

export async function fetchAgencias(): Promise<Agencia[]> {
  try {
    const response = await fetch(URLS.agencias);
    const text = await response.text();
    const parsedData = parseCSV(text);
    return parsedData.map(formatAgencia);
  } catch (error) {
    console.error("Erro ao buscar agências:", error);
    return [];
  }
}

// Função para buscar todos os dados de uma vez
export async function fetchAllData() {
  const [clientes, contas, agencias] = await Promise.all([
    fetchClientes(),
    fetchContas(),
    fetchAgencias(),
  ]);

  return { clientes, contas, agencias };
}
