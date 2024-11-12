import React, { useState } from 'react';
import {API_URL, addMercadoria} from '../services/api';


function MercadoriaForm({ mercadoria}) {
    const [formData, setFormData] = useState(mercadoria || {});
    const [successMessage] = useState('');
    const [errorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Fazer a requisição GET para verificar se o número de registro já existe
        fetch(`${API_URL}/mercadorias`)
            .then((response) => response.json())
            .then((data) => {
                // Verificar se algum item tem o mesmo 'numero_registro'
                const existingMercadoria = data.find(
                    (mercadoria) => mercadoria[2] === formData.numero_registro // "numero_registro" é o terceiro valor no array
                );

                if (existingMercadoria) {
                    // Se o número de registro já existir, exibir erro
                    alert('Este número de registro já está cadastrado.');
                } else {
                    // Se o número de registro não existir, prosseguir com o cadastro
                    addMercadoria(formData)
                        .then((data) => {
                            alert(data.message);
                            setFormData({}); // Limpar todos os campos após sucesso
                        })
                        .catch(() => alert('Erro ao cadastrar mercadoria. Tente novamente.'));
                }
            })
            .catch(() => alert('Erro ao verificar número de registro. Tente novamente.'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="nome"
                placeholder="Nome"
                value={formData.nome || ''}
                onChange={handleInputChange}
                required
            />
            <input
                name="numero_registro"
                placeholder="Número de Registro"
                value={formData.numero_registro || ''}
                onChange={handleInputChange}
                required
            />
            <input
                name="fabricante"
                placeholder="Fabricante"
                value={formData.fabricante || ''}
                onChange={handleInputChange}
                required
            />
            <input
                name="tipo"
                placeholder="Tipo"
                value={formData.tipo || ''}
                onChange={handleInputChange}
                required
            />
            <input
                name="descricao"
                placeholder="Descrição"
                value={formData.descricao || ''}
                onChange={handleInputChange}
                required
            />
            <button type="submit">
                {formData.id ? "Atualizar" : "Cadastrar"} Mercadoria
            </button>

            {/* Exibindo mensagens de sucesso ou erro */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
    );
}

export default MercadoriaForm;
