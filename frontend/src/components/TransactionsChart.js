import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';  // Alterado para Line
import './css/styles.css'; // Adicione estilos conforme necessário

function TransactionsChart() {
    const [mercadorias, setMercadorias] = useState([]);
    const [selectedMercadoria, setSelectedMercadoria] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMercadorias, setFilteredMercadorias] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/relatorio')
            .then(response => response.json())
            .then(data => {
                setMercadorias(data);
                setFilteredMercadorias(data); // Inicializa as mercadorias com todos os dados
            })
            .catch(error => {
                console.error("Erro ao carregar os dados:", error);
            });
    }, []);

    // Função para manipular a mudança no select
    const handleSelectChange = (event) => {
        setSelectedMercadoria(event.target.value);
    };

    // Função para filtrar mercadorias com base na pesquisa
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Filtra as mercadorias que incluem o nome digitado
        const filtered = mercadorias.filter(mercadoria =>
            mercadoria.nome.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMercadorias(filtered);
    };

    // Função chamada quando uma sugestão é clicada
    const handleSuggestionClick = (mercadoria) => {
        setSelectedMercadoria(mercadoria.nome);
        setSearchQuery(mercadoria.nome);
        setFilteredMercadorias([]); // Limpa as sugestões após a seleção
    };

    const mercadoriaSelecionada = mercadorias.find(mercadoria => mercadoria.nome === selectedMercadoria);

    // Caso a mercadoria selecionada exista, pegamos os dados para exibir
    const chartData = mercadoriaSelecionada ? {
        labels: mercadoriaSelecionada.labels, // Meses são os rótulos
        datasets: [
            {
                label: 'Entradas',
                data: mercadoriaSelecionada.entradas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false, // Não preenche a área abaixo da linha
                tension: 0.4 // Torna a linha um pouco mais suave
            },
            {
                label: 'Saídas',
                data: mercadoriaSelecionada.saidas,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false, // Não preenche a área abaixo da linha
                tension: 0.4 // Torna a linha um pouco mais suave
            }
        ]
    } : null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: 'rgba(0, 0, 0, 0.7)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 14,
                    },
                    color: 'rgba(0, 0, 0, 0.7)',
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16,
                    },
                    color: 'rgba(0, 0, 0, 0.8)',
                }
            },
            tooltip: {
                bodyFont: {
                    size: 14,
                },
                titleFont: {
                    size: 16,
                }
            }
        }
    };

    return (
        <div className="chart-container">
            {/* Barra de pesquisa para procurar mercadorias */}
            <div className="search-container">
                <input
                    type="text"
                    name="nome"
                    placeholder="Pesquisar mercadoria"
                    value={searchQuery} // Use searchQuery como valor
                    onChange={handleSearchChange} // Atualiza a pesquisa conforme o usuário digita
                    autoComplete="off"
                />
                {/* Exibindo as sugestões de mercadorias */}
                {searchQuery && filteredMercadorias.length > 0 && (
                    <div className="autocomplete-suggestions">
                        {filteredMercadorias.map(mercadoria => (
                            <div
                                key={mercadoria.nome}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(mercadoria)}
                            >
                                {mercadoria.nome}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Exibindo o gráfico apenas se uma mercadoria for selecionada */}
            {selectedMercadoria && mercadoriaSelecionada && (
                <Line data={chartData} options={options} />  
            )}
        </div>
    );
}

export default TransactionsChart;
