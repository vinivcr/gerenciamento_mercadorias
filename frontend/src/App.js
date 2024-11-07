import React, { useState, useEffect } from 'react';
import { fetchMercadorias, fetchReportData, downloadPDF } from './services/api'; 
import TransactionForm from './components/TransactionForm';
import TransactionsChart from './components/TransactionsChart';
import './components/css/styles.css';  // Importando o arquivo CSS para estilização

function App() {
    const [mercadorias, setMercadorias] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');  
    const [months, setMonths] = useState([]);  

    const refreshData = () => {
        fetchMercadorias()
            .then(data => {
                if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
                    const flattenedData = data.flat(); 
                    console.log("Dados recebidos e transformados:", flattenedData);
                    setMercadorias(flattenedData);
                } else {
                    console.log("Dados recebidos:", data);
                    setMercadorias(data);
                }
            })
            .catch(error => console.error('Erro ao buscar mercadorias:', error));
    };

    useEffect(() => {
        refreshData();
    }, []);

    const fetchMonths = () => {
        fetchReportData()
            .then(data => {
                const availableMonths = data[0]?.labels || [];
                setMonths(availableMonths);
            })
            .catch(error => console.error('Erro ao obter meses:', error));
    };

    useEffect(() => {
        fetchMonths();
    }, []);

    const handleExportPDF = () => {
        if (selectedMonth) {
            downloadPDF(selectedMonth);
        } else {
            alert('Por favor, selecione um mês para exportar o relatório.');
        }
    };

    return (
        <div className="container">
            <h1>Gerenciamento de Mercadorias</h1>

            <div className="form-chart-container">
                <div className="form-container">
                    <TransactionForm 
                        mercadorias={mercadorias} 
                        refreshData={refreshData} 
                    />
                </div>

                <div className="chart-container">
                    <h1>Gráfico de vendas</h1>
                    <TransactionsChart />
                </div>
            </div>

            <div className="export-container">
                <h1>Exportar relatório mensal</h1>
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">Selecione um mês</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>

                <button onClick={handleExportPDF}>Exportar Relatório em PDF</button>
            </div>
        </div>
    );
}

export default App;
