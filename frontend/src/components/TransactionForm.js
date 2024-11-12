import React, { useState, useEffect} from 'react';
import './css/styles.css';
import MercadoriaForm from './MercadoriaForm';
import { API_URL} from '../services/api';

function TransactionForm() {
    const [mercadorias, setMercadorias] = useState([]); // Estado para armazenar as mercadorias
    const [filteredMercadorias, setFilteredMercadorias] = useState([]); // Estado para armazenar as mercadorias filtradas
    const [searchQuery, setSearchQuery] = useState('');
    const [transaction, setTransaction] = useState({
        mercadoria_id: '',
        quantidade: '',
        data_hora: '',
        local: '',
        nome: '',
        numero_registro: '',
        fabricante: '',
        tipo: '',
        descricao: ''
    });
    const clearFields = () => {
        setSearchQuery('');  // Limpa o campo de pesquisa
        setTransaction({
            mercadoria_id: '',
            quantidade: '',
            data_hora: '',
            local: '',
            nome: '',
            numero_registro: '',
            fabricante: '',
            tipo: '',
            descricao: ''
        });  // Limpa todos os campos do formulário
    };    
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEntrada, setIsEntrada] = useState('');
    const [showCadastro, setShowCadastro] = useState(true);
    const [showUpdate, setShowUpdate] = useState('');  // Novo estado para controlar a atualização
    
    const refreshData = () => {
        fetch(`${API_URL}/mercadorias/mercadorias`)
            .then(response => response.json())
            .then(data => {
                setMercadorias(data);
                setFilteredMercadorias(data);
            })
            .catch(error => {
                console.error('Erro ao buscar mercadorias:', error);
            });
    };
    

    useEffect(() => {
        // Fetch data from the API when the component mounts
        fetch(`${API_URL}/mercadorias`)
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
        
        // Atualiza o valor da pesquisa
        setSearchQuery(query);
    
        // Atualiza o nome da mercadoria na transação com o valor do campo de pesquisa
        setTransaction({ 
            ...transaction, 
            nome: query  // Atualiza o nome da mercadoria com o valor de pesquisa
        });
    
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
                // Exibe a mensagem de sucesso em um alert
                alert(data.message || (isEntrada ? 'Entrada registrada com sucesso!' : 'Saída registrada com sucesso!'));
                //refreshData();
                // Limpa os campos
                clearFields();
                setErrorMessage('');
            } else {
                // Em caso de falha, exibe uma mensagem de erro
                setErrorMessage('Erro ao registrar a mercadoria. Tente novamente.');
                setSuccessMessage('');
            }
        })
        .catch(error => {
            console.error("Erro ao registrar:", error);
            alert('Erro ao registrar a mercadoria. Tente novamente.');
            setSuccessMessage('');
        });
    };
    
    const handleSuggestionClick = (mercadoria) => {
        // Preenche o campo de pesquisa e seleciona a mercadoria
        setSearchQuery(mercadoria[1]);  // Preenche o campo de pesquisa com o nome da mercadoria
        setTransaction({ 
            ...transaction, 
            mercadoria_id: mercadoria[0], 
            nome: mercadoria[1],
            numero_registro: mercadoria[2],
            fabricante: mercadoria[3],
            tipo: mercadoria[4],
            descricao: mercadoria[5]
        });  // Atualiza o estado da mercadoria selecionada
        setFilteredMercadorias([]);  // Esconde as sugestões após a seleção
        //refreshData();
    };

    const handleUpdateMercadoria = () => {
        const url = `${API_URL}/mercadorias/${transaction.mercadoria_id}`;
    
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); 
            refreshData();
            clearFields();
        })
        .catch(error => {
            console.error('Erro ao atualizar a mercadoria:', error);
            alert('Erro ao atualizar a mercadoria. Tente novamente.');
            setSuccessMessage('');
        });
    };

    const handleDeleteMercadoria = () => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta mercadoria?");
        
        if (confirmDelete) {
            const url = `${API_URL}/mercadorias/${transaction.mercadoria_id}`;
            
            fetch(url, {
                method: 'DELETE',  // Método DELETE para excluir
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);  // Mensagem de sucesso
                refreshData();  // Caso queira atualizar a lista após a exclusão
            })
            .catch(error => {
                console.error('Erro ao excluir a mercadoria:', error);
                alert('Erro ao excluir a mercadoria. Tente novamente.');
                setSuccessMessage('');
            });
        } else {
            console.log("Exclusão cancelada");
        }
    };
    

    return (
        <div className="form">
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
                    className={showCadastro ? 'active' : ''}>
                    Cadastrar Mercadoria
                </button>
                <button 
                    type="button" 
                    onClick={() => { setShowCadastro(false); setShowUpdate(true); }}
                    className={showUpdate ? 'active' : ''}>
                    Atualizar Mercadoria
                </button>
                <button 
                    type="button" 
                    onClick={() => { setIsEntrada(true); setShowCadastro(false); setShowUpdate(false); }}
                    className={isEntrada && !showCadastro && !showUpdate ? 'active' : ''}>
                    Registrar Entrada
                </button>
                <button 
                    type="button" 
                    onClick={() => { setIsEntrada(false); setShowCadastro(false); setShowUpdate(false); }}
                    className={!isEntrada && !showCadastro && !showUpdate ? 'active' : ''}>
                    Registrar Saída
                </button>
            </div>

            {showCadastro ? (
                <MercadoriaForm refreshData={refreshData} />
            ) : showUpdate ? (
                <form>
                    <div className="search-container">
                        <input
                            type="text"
                            name="nome"
                            placeholder="Pesquisar mercadoria"
                            value={transaction.nome || searchQuery}  // Use o nome da mercadoria ou searchQuery como valor
                            onChange={handleSearchChange} // Atualiza a pesquisa conforme o usuário digita
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
                    <button type="button" onClick={handleUpdateMercadoria}>
                        Atualizar Mercadoria
                    </button>
                    <button type="button" onClick={handleDeleteMercadoria}>
                        Excluir Mercadoria
                    </button>
                </form>
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
                        placeholder="Quantidade"
                        value={transaction.quantidade}
                        onChange={(e) => setTransaction({ ...transaction, quantidade: e.target.value })}
                    />
                    <input
                        type="datetime-local"
                        placeholder="Data e Hora"
                        value={transaction.data_hora}
                        onChange={(e) => setTransaction({ ...transaction, data_hora: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Local"
                        value={transaction.local}
                        onChange={(e) => setTransaction({ ...transaction, local: e.target.value })}
                    />
                    <button type="submit">{isEntrada ? 'Registrar Entrada' : 'Registrar Saída'}</button>
                </form>
            )}
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
}

export default TransactionForm;
