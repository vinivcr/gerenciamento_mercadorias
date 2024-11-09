import React, { useState, useEffect } from 'react';
import './css/styles.css';
import MercadoriaForm from './MercadoriaForm';

function TransactionForm({ refreshData }) {
    const [mercadorias, setMercadorias] = useState([]); // Estado para armazenar as mercadorias
    const [filteredMercadorias, setFilteredMercadorias] = useState([]); // Estado para armazenar as mercadorias filtradas
    const [searchQuery, setSearchQuery] = useState('');
    const [transaction, setTransaction] = useState({
        mercadoria_id: '',
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

    const handleTransactionSubmit = (e) => {
        e.preventDefault();
        const url = isEntrada ? 'http://localhost:5000/entradas' : 'http://localhost:5000/saidas';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success || data.message) {
                setSuccessMessage(data.message || (isEntrada ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!'));
                setTransaction({
                    mercadoria_id: '',
                    quantidade: '',
                    data_hora: '',
                    local: ''
                });
                setErrorMessage('');
            } else {
                setErrorMessage('Erro ao registrar a mercadoria. Tente novamente.');
                setSuccessMessage('');
            }
        })
        .catch(error => {
            console.error("Erro ao registrar:", error);
            setErrorMessage('Erro ao registrar a mercadoria. Tente novamente.');
            setSuccessMessage('');
        });
    };

    const handleSuggestionClick = (mercadoria) => {
        // Preenche o campo de pesquisa e seleciona a mercadoria
        setSearchQuery(mercadoria[1]);  // Preenche o campo de pesquisa com o nome da mercadoria
        setTransaction({ ...transaction, mercadoria_id: mercadoria[0], mercadoria_nome: mercadoria[1] });  // Atualiza o estado da mercadoria selecionada
        setFilteredMercadorias([]);  // Esconde as sugestões após a seleção
    };

    const handleUpdateClick = (mercadoria) => {
        // Preenche o formulário de edição com os dados da mercadoria
        setSearchQuery(mercadoria[1]);
        setTransaction({
            ...transaction,
            mercadoria_id: mercadoria[0],
            mercadoria_nome: mercadoria[1],
            numero_registro: mercadoria[2],  // Adiciona os dados da mercadoria para edição
            fabricante: mercadoria[3],
            tipo: mercadoria[4],
            descricao: mercadoria[5]
        });
        setShowUpdate(true); // Exibe o formulário de atualização
        setFilteredMercadorias([]);  // Esconde as sugestões após a seleção
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
            ) : (
                <form onSubmit={handleTransactionSubmit}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Pesquisar mercadoria"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            autoComplete="off"
                        />
                        {/* Exibe as sugestões dentro do campo de pesquisa */}
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
