import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Não renderizar paginação se houver apenas uma página
  if (totalPages <= 1) return null;

  // Gerar array de páginas a serem mostradas
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];

    // Sempre mostrar a primeira página
    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ajustar se estamos próximos do início ou fim
    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2);
    }

    // Adicionar ellipsis antes dos números do meio
    if (startPage > 2) {
      pages.push("...");
    }

    // Adicionar números do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Adicionar ellipsis depois dos números do meio
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Sempre mostrar a última página se houver mais de uma página
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="pagination" aria-label="Paginação de resultados">
      <ul>
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            &laquo;
          </button>
        </li>

        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="ellipsis">...</span>
            ) : (
              <button
                className={currentPage === page ? "active" : ""}
                onClick={() => typeof page === "number" && onPageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`Página ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
