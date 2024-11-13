//const API_URL = process.env.REACT_APP_API_URL; configuração futura
const API_URL = "http://52.67.116.9:5000";

export {API_URL}; 


// Funções para CRUD de mercadorias
export async function fetchMercadorias() {
    const response = await fetch(`${API_URL}/mercadorias`);
    return response.json();
}

export const addMercadoria = async (mercadoria) => {
    try {
        const response = await fetch(`${API_URL}/mercadorias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mercadoria)
        });
        return await response.json();
    } catch (err) {
        console.error('Erro ao adicionar mercadoria:', err);
    }
};


// Funções para entradas e saídas
export async function addEntrada(data) {
    const response = await fetch(`${API_URL}/entradas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

export async function addSaida(data) {
    const response = await fetch(`${API_URL}/saidas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Função para obter dados de transações para o gráfico
export async function fetchReportData() {
    const response = await fetch(`${API_URL}/relatorio`);
    return response.json();
}

// Função para exportar relatório em PDF
export async function downloadPDF(selectedMonth) {
    const response = await fetch(`${API_URL}/relatorio/pdf?month=${selectedMonth}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_${selectedMonth}.pdf`; // Nome do arquivo com o mês
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        alert('Erro ao gerar o relatório. Tente novamente.');
    }
}
