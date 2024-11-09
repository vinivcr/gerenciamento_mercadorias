-- Inserir mercadorias de logística na tabela Mercadorias
INSERT INTO Mercadorias (nome, numero_registro, fabricante, tipo, descricao)
VALUES
('Palete de Madeira', 'REG1234', 'LogiCorp', 'Armazenagem', 'Palete de madeira para armazenagem de mercadorias'),
('Caixa de Plástico', 'REG5678', 'PlastiCo', 'Embalagem', 'Caixa plástica para transporte de itens pequenos'),
('Carro de Transporte', 'REG9101', 'TransCo', 'Transporte', 'Carro para transporte de mercadorias no depósito'),
('Contêiner', 'REG1122', 'Container Ltda', 'Armazenagem', 'Contêiner metálico para transporte de carga pesada'),
('Esteira Transportadora', 'REG3344', 'ConveyorCo', 'Transporte', 'Esteira para movimentação de mercadorias em grandes volumes');

-- Inserir entradas para as mercadorias com datas de 6 meses atrás
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 100, '2024-05-01 10:00:00', 'Depósito Central'),
(2, 200, '2024-05-02 11:30:00', 'Armazém 1'),
(3, 50, '2024-05-05 08:15:00', 'Área de Carga'),
(4, 10, '2024-05-07 14:45:00', 'Depósito Central'),
(5, 5, '2024-05-10 09:00:00', 'Área de Carga');

-- Inserir saídas para as mercadorias com datas de 6 meses atrás
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 30, '2024-05-15 13:00:00', 'Centro de Distribuição'),
(2, 50, '2024-05-17 10:30:00', 'Loja 1'),
(3, 25, '2024-05-20 16:00:00', 'Área de Carga'),
(4, 2, '2024-05-22 12:30:00', 'Centro de Distribuição'),
(5, 3, '2024-05-25 11:00:00', 'Loja 2');

-- Inserir entradas para os meses subsequentes, com datas variadas
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 120, '2024-06-01 08:00:00', 'Depósito Central'),
(2, 250, '2024-06-03 09:15:00', 'Armazém 1'),
(3, 70, '2024-06-06 10:45:00', 'Área de Carga'),
(4, 15, '2024-06-09 13:30:00', 'Depósito Central'),
(5, 8, '2024-06-12 11:30:00', 'Área de Carga');

-- Inserir saídas para os meses subsequentes
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 50, '2024-06-15 14:00:00', 'Centro de Distribuição'),
(2, 75, '2024-06-18 10:30:00', 'Loja 1'),
(3, 30, '2024-06-22 13:00:00', 'Área de Carga'),
(4, 5, '2024-06-25 15:30:00', 'Centro de Distribuição'),
(5, 6, '2024-06-28 16:00:00', 'Loja 2');

-- Continuação com mais entradas e saídas, ajustando para 6 meses de dados
-- (Adicione entradas e saídas adicionais conforme necessário)
-- Inserir entradas e saídas para os meses seguintes (Julho a Novembro de 2024)
-- Entradas para Julho
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 150, '2024-07-01 08:00:00', 'Depósito Central'),
(2, 300, '2024-07-03 09:15:00', 'Armazém 1'),
(3, 80, '2024-07-05 10:45:00', 'Área de Carga'),
(4, 20, '2024-07-08 13:30:00', 'Depósito Central'),
(5, 10, '2024-07-10 11:30:00', 'Área de Carga');

-- Saídas para Julho
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 60, '2024-07-15 14:00:00', 'Centro de Distribuição'),
(2, 100, '2024-07-17 10:30:00', 'Loja 1'),
(3, 40, '2024-07-20 16:00:00', 'Área de Carga'),
(4, 7, '2024-07-22 12:30:00', 'Centro de Distribuição'),
(5, 8, '2024-07-25 11:00:00', 'Loja 2');

-- Entradas para Agosto
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 170, '2024-08-01 08:00:00', 'Depósito Central'),
(2, 350, '2024-08-03 09:15:00', 'Armazém 1'),
(3, 90, '2024-08-06 10:45:00', 'Área de Carga'),
(4, 25, '2024-08-09 13:30:00', 'Depósito Central'),
(5, 12, '2024-08-12 11:30:00', 'Área de Carga');

-- Saídas para Agosto
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 70, '2024-08-15 14:00:00', 'Centro de Distribuição'),
(2, 120, '2024-08-17 10:30:00', 'Loja 1'),
(3, 45, '2024-08-20 16:00:00', 'Área de Carga'),
(4, 10, '2024-08-22 12:30:00', 'Centro de Distribuição'),
(5, 10, '2024-08-25 11:00:00', 'Loja 2');

-- Entradas para Setembro
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 180, '2024-09-01 08:00:00', 'Depósito Central'),
(2, 400, '2024-09-03 09:15:00', 'Armazém 1'),
(3, 100, '2024-09-05 10:45:00', 'Área de Carga'),
(4, 30, '2024-09-08 13:30:00', 'Depósito Central'),
(5, 15, '2024-09-10 11:30:00', 'Área de Carga');

-- Saídas para Setembro
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 80, '2024-09-15 14:00:00', 'Centro de Distribuição'),
(2, 150, '2024-09-17 10:30:00', 'Loja 1'),
(3, 50, '2024-09-20 16:00:00', 'Área de Carga'),
(4, 12, '2024-09-22 12:30:00', 'Centro de Distribuição'),
(5, 12, '2024-09-25 11:00:00', 'Loja 2');

-- Entradas para Outubro
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 200, '2024-10-01 08:00:00', 'Depósito Central'),
(2, 450, '2024-10-03 09:15:00', 'Armazém 1'),
(3, 120, '2024-10-06 10:45:00', 'Área de Carga'),
(4, 35, '2024-10-09 13:30:00', 'Depósito Central'),
(5, 18, '2024-10-12 11:30:00', 'Área de Carga');

-- Saídas para Outubro
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 90, '2024-10-15 14:00:00', 'Centro de Distribuição'),
(2, 175, '2024-10-17 10:30:00', 'Loja 1'),
(3, 60, '2024-10-20 16:00:00', 'Área de Carga'),
(4, 15, '2024-10-22 12:30:00', 'Centro de Distribuição'),
(5, 14, '2024-10-25 11:00:00', 'Loja 2');

-- Entradas para Novembro
INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 220, '2024-11-01 08:00:00', 'Depósito Central'),
(2, 500, '2024-11-03 09:15:00', 'Armazém 1'),
(3, 130, '2024-11-05 10:45:00', 'Área de Carga'),
(4, 40, '2024-11-08 13:30:00', 'Depósito Central'),
(5, 20, '2024-11-10 11:30:00', 'Área de Carga');

-- Saídas para Novembro
INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
VALUES
(1, 100, '2024-11-15 14:00:00', 'Centro de Distribuição'),
(2, 200, '2024-11-17 10:30:00', 'Lmysqloja 1'),
(3, 70, '2024-11-20 16:00:00', 'Área de Carga'),
(4, 18, '2024-11-22 12:30:00', 'Centro de Distribuição'),
(5, 16, '2024-11-25 11:00:00', 'Loja 2');
