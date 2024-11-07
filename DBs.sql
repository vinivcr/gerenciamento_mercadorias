CREATE DATABASE IF NOT EXISTS mstarsupply;
USE mstarsupply;

CREATE TABLE Mercadorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    numero_registro VARCHAR(50) NOT NULL,
    fabricante VARCHAR(255),
    tipo VARCHAR(50),
    descricao TEXT
);

CREATE TABLE Entradas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mercadoria_id INT,
    quantidade INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    local VARCHAR(255),
    FOREIGN KEY (mercadoria_id) REFERENCES Mercadorias(id)
);

CREATE TABLE Saidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mercadoria_id INT,
    quantidade INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    local VARCHAR(255),
    FOREIGN KEY (mercadoria_id) REFERENCES Mercadorias(id)
);
