import React, { useState, useEffect } from 'react';
import './css/styles.css';
import MercadoriaForm from './MercadoriaForm';

function TransactionForm({ refreshData }) {
    const [mercadorias, setMercadorias] = useState([]); // Estado para armazenar as mercadorias
    const [filteredMercadorias, setFilteredMercadorias] = useState([]); // Estado para armazenar as mercadorias filtradas
    const [searchQuery, setSearchQuery] = useState('');
    const [transaction, setTransaction] = useState({
        mercadoria_id: '',
        nome: '',
        numero_registro: '',
        fabricante: '',
        tipo: '',
        descricao: '',
        quantidade: '',
        data_hora: '',
        local: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEntrada, setIsEntrada] = useState(false);
    const [showCadastro, setShowCadastro] = useState(true);
    const [showUpdate, setShowUpdate] = useState(false);  // Novo estado para controlar a atualização

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch('http://localhost:5000/mercadorias')
            .then(response => response.json())
            .then(data => {
                console.log("Mercadorias recebidas da API:", data);
                setMercadorias(data);  // Armazena as mercadorias
                setFilteredMercadorias(data); // Inicializa as mercadorias filtradas com todos os dados
            })
            .catch(error => {
                console.error('Erro ao buscar mercadorias:', error);
            });
    }, []); // Esse useEffect roda apenas uma vez quando o componente é montado

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filtra as mercadorias com base na entrada
        if (query) {
            const filtered = mercadorias.filter(mercadoria =>
                mercadoria[1].toLowerCase().includes(query.toLowerCase()) // Filtra pelo nome da mercadoria
            );
            setFilteredMercadorias(filtered);
        } else {
            setFilteredMercadorias(mercadorias); // Reseta para todas as mercadorias quando não há pesquisa
        }
    };

    const handleSuggestionClick = (mercadoria) => {
        // Preenche o campo de pesquisa e o formulário com os dados da mercadoria selecionada
        setSearchQuery(mercadoria[1]);  // Preenche o campo de pesquisa com o nome da mercadoria
        setTransaction({
            mercadoria_id: mercadoria[0],
            nome: mercadoria[1],
            numero_registro: mercadoria[2],
            fabricante: mercadoria[3],
            tipo: mercadoria[4],
            descricao: mercadoria[5]
        });
        setFilteredMercadorias([]);  // Esconde as sugestões após a seleção
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/mercadorias/${transaction.mercadoria_id}`;

        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: transaction.nome,
                numero_registro: transaction.numero_registro,
                fabricante: transaction.fabricante,
                tipo: transaction.tipo,
                descricao: transaction.descricao
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success || data.message) {
                setSuccessMessage('Mercadoria atualizada com sucesso!');
                setErrorMessage('');
                refreshData();  // Atualiza a lista de mercadorias
            } else {
                setErrorMessage('Erro ao atualizar a mercadoria. Tente novamente.');
                setSuccessMessage('');
            }
        })
        .catch(error => {
            console.error("Erro ao atualizar:", error);
            setErrorMessage('Erro ao atualizar a mercadoria. Tente novamente.');
            setSuccessMessage('');
        });
    };

    return (
        <div className="form-container">
            <h2>
                {showCadastro 
                    ? 'Cadastrar Nova Mercadoria' 
                    : (showUpdate 
                        ? 'Atualizar Mercadoria' 
                        : (isEntrada 
                            ? 'Registrar Entrada' 
                            : 'Registrar Saída')
                    )
                }
            </h2>

            <div className="toggle-buttons">
                <button 
                    type="button" 
                    onClick={() => { setShowCadastro(true); setShowUpdate(false); }}
                    className={showCadastro ? 'active' : ''}
                >
                    Cadastrar Mercadoria
                </button>
                <button 
                    type="button" 
                    onClick={() => { setShowCadastro(false); setShowUpdate(true); }}
                    className={showUpdate ? 'active' : ''}
                >
                    Atualizar Mercadoria
                </button>
                <button 
                    type="button" 
                    onClick={() => { setIsEntrada(true); setShowCadastro(false); setShowUpdate(false); }}
                    className={isEntrada && !showCadastro && !showUpdate ? 'active' : ''}
                >
                    Registrar Entrada
                </button>
                <button 
                    type="button" 
                    onClick={() => { setIsEntrada(false); setShowCadastro(false); setShowUpdate(false); }}
                    className={!isEntrada && !showCadastro && !showUpdate ? 'active' : ''}
                >
                    Registrar Saída
                </button>
            </div>

            {showCadastro ? (
                <MercadoriaForm refreshData={refreshData} />
            ) : showUpdate ? (
                <form onSubmit={handleUpdateSubmit}>
                    {/* Caixa de pesquisa para selecionar a mercadoria a ser atualizada */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Pesquisar mercadoria para atualizar"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        {searchQuery && filteredMercadorias.length > 0 && (
                            <div className="autocomplete-suggestions">
                                {filteredMercadorias.map(mercadoria => (
                                    <div
                                        key={mercadoria[0]}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(mercadoria)}
                                    >
                                        {mercadoria[1]}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Campos preenchidos para edição */}
                    <input 
                        name="nome"
                        placeholder="Nome da Mercadoria"
                        value={transaction.nome || ''}
                        onChange={(e) => setTransaction({ ...transaction, nome: e.target.value })}
                    />
                    <input 
                        name="numero_registro"
                        placeholder="Número de Registro"
                        value={transaction.numero_registro || ''}
                        onChange={(e) => setTransaction({ ...transaction, numero_registro: e.target.value })}
                    />
                    <input 
                        name="fabricante"
                        placeholder="Fabricante"
                        value={transaction.fabricante || ''}
                        onChange={(e) => setTransaction({ ...transaction, fabricante: e.target.value })}
                    />
                    <input 
                        name="tipo"
                        placeholder="Tipo"
                        value={transaction.tipo || ''}
                        onChange={(e) => setTransaction({ ...transaction, tipo: e.target.value })}
                    />
                    <input 
                        name="descricao"
                        placeholder="Descrição"
                        value={transaction.descricao || ''}
                        onChange={(e) => setTransaction({ ...transaction, descricao: e.target.value })}
                    />
                    <button type="submit">Atualizar Mercadoria</button>
                </form>
            ) : (
                // Formulário para registrar entrada ou saída, sem os campos de atualização
                <form onSubmit={handleTransactionSubmit}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Pesquisar mercadoria"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        {searchQuery && filteredMercadorias.length > 0 && (
                            <div className="autocomplete-suggestions">
                                {filteredMercadorias.map(mercadoria => (
                                    <div
                                        key={mercadoria[0]}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(mercadoria)}
                                    >
                                        {mercadoria[1]}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input 
                        type="number"
                        name="quantidade" 
                        placeholder="Quantidade" 
                        value={transaction.quantidade}
                        onChange={(e) => setTransaction({ ...transaction, quantidade: e.target.value })}
                        required 
                        min="0"
                        step="1"
                    />
                    <input 
                        type="datetime-local" 
                        name="data_hora" 
                        value={transaction.data_hora}
                        onChange={(e) => setTransaction({ ...transaction, data_hora: e.target.value })}
                        required 
                    />
                    <input 
                        name="local" 
                        placeholder="Local" 
                        value={transaction.local}
                        onChange={(e) => setTransaction({ ...transaction, local: e.target.value })}
                        required 
                    />
                    <button type="submit">{isEntrada ? 'Registrar Entrada' : 'Registrar Saída'}</button>
                </form>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default TransactionForm;
