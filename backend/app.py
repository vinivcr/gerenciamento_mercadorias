from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from models import get_db_connection, add_mercadoria, fetch_all_mercadorias
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
import calendar
import io

app = Flask(__name__)
CORS(app)


@app.route('/')
def homepage():
    return 'API online'


@app.route('/mercadorias', methods=['GET', 'POST'])
def manage_mercadorias():
    if request.method == 'POST':
        data = request.get_json()
        add_mercadoria(data)
        return jsonify({'message': 'Mercadoria cadastrada com sucesso!'}), 201
    elif request.method == 'GET':
        mercadorias = fetch_all_mercadorias()
        return jsonify(mercadorias)



@app.route('/mercadorias/disponibilidade', methods=['GET'])
def verificar_disponibilidade():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            m.id,
            m.nome,
            COALESCE(SUM(e.quantidade), 0) AS total_entradas,
            COALESCE(SUM(s.quantidade), 0) AS total_saidas,
            (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(s.quantidade), 0)) AS quantidade_disponivel
        FROM 
            Mercadorias m
        LEFT JOIN 
            Entradas e ON m.id = e.mercadoria_id
        LEFT JOIN 
            Saidas s ON m.id = s.mercadoria_id
        GROUP BY 
            m.id, m.nome;
    """)
    result = cursor.fetchall()
    conn.close()

    # Formatar a resposta
    mercadorias_disponiveis = []
    for row in result:
        mercadorias_disponiveis.append({
            'id': row[0],
            'nome': row[1],
            'total_entradas': row[2],
            'total_saidas': row[3],
            'quantidade_disponivel': row[4]
        })

    return jsonify(mercadorias_disponiveis)

@app.route('/mercadorias/<int:id>', methods=['PUT', 'DELETE'])
def update_delete_mercadoria(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if request.method == 'PUT':
        data = request.get_json()
        cursor.execute("""
            UPDATE Mercadorias
            SET nome=%s, numero_registro=%s, fabricante=%s, tipo=%s, descricao=%s
            WHERE id=%s
        """, (data['nome'], data['numero_registro'], data['fabricante'], data['tipo'], data['descricao'], id))
        conn.commit()
        return jsonify({'message': 'Mercadoria atualizada com sucesso!'})
    
    elif request.method == 'DELETE':
        try:
            # Verificar se a mercadoria tem registros na tabela Entradas
            cursor.execute("""
                SELECT COUNT(*) 
                FROM Entradas 
                WHERE mercadoria_id = %s
            """, (id,))
            entradas_count = cursor.fetchone()[0]

            # Verificar se a mercadoria tem registros na tabela Saidas
            cursor.execute("""
                SELECT COUNT(*) 
                FROM Saidas 
                WHERE mercadoria_id = %s
            """, (id,))
            saidas_count = cursor.fetchone()[0]

            # Se houver registros na tabela de Entradas ou Saídas, não tenta excluir
            if entradas_count > 0 or saidas_count > 0:
                return jsonify({'message': 'Não é possível excluir a mercadoria, pois existem registros de entradas ou saídas vinculados.'}), 400
            
            # Se não houver registros relacionados, tenta excluir a mercadoria
            cursor.execute("DELETE FROM Mercadorias WHERE id = %s", (id,))
            conn.commit()
            return jsonify({'message': 'Mercadoria excluída com sucesso!'})

        except Exception as e:
            # Caso ocorra algum erro inesperado durante a exclusão
            return jsonify({'message': f'Erro ao tentar excluir a mercadoria: {str(e)}'}), 500

        finally:
            cursor.close()
            conn.close()


@app.route('/entradas', methods=['POST'])
def add_entrada():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Entradas (mercadoria_id, quantidade, data_hora, local)
        VALUES (%s, %s, %s, %s)
    """, (data['mercadoria_id'], data['quantidade'], data['data_hora'], data['local']))
    conn.commit()
    return jsonify({'message': 'Entrada registrada com sucesso!'}), 201

@app.route('/saidas', methods=['POST'])
def add_saida():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Saidas (mercadoria_id, quantidade, data_hora, local)
        VALUES (%s, %s, %s, %s)
    """, (data['mercadoria_id'], data['quantidade'], data['data_hora'], data['local']))
    conn.commit()
    return jsonify({'message': 'Saída registrada com sucesso!'}), 201

from flask import jsonify

@app.route('/relatorio', methods=['GET'])
def get_monthly_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Consultando entradas por mercadoria
    cursor.execute("""
        SELECT m.nome, DATE_FORMAT(e.data_hora, '%Y-%m') AS mes, SUM(e.quantidade) 
        FROM Entradas e
        JOIN Mercadorias m ON e.mercadoria_id = m.id
        GROUP BY m.nome, mes
    """)
    entradas = cursor.fetchall()
    
    # Consultando saídas por mercadoria
    cursor.execute("""
        SELECT m.nome, DATE_FORMAT(s.data_hora, '%Y-%m') AS mes, SUM(s.quantidade) 
        FROM Saidas s
        JOIN Mercadorias m ON s.mercadoria_id = m.id
        GROUP BY m.nome, mes
    """)
    saidas = cursor.fetchall()
    
    conn.close()

    # Organizando os dados por mercadoria
    mercadorias = {}
    
    for nome, mes, qtd in entradas:
        if nome not in mercadorias:
            mercadorias[nome] = {'entradas': {}, 'saidas': {}}
        mercadorias[nome]['entradas'][mes] = qtd

    for nome, mes, qtd in saidas:
        if nome not in mercadorias:
            mercadorias[nome] = {'entradas': {}, 'saidas': {}}
        mercadorias[nome]['saidas'][mes] = qtd

    # Criando as labels (meses) e preenchendo as quantidades
    labels = sorted(set([mes for _, mes, _ in entradas] + [mes for _, mes, _ in saidas]))
    
    response_data = []
    for nome, dados in mercadorias.items():
        entradas_data = [dados['entradas'].get(mes, 0) for mes in labels]
        saidas_data = [dados['saidas'].get(mes, 0) for mes in labels]
        response_data.append({
            'nome': nome,
            'entradas': entradas_data,
            'saidas': saidas_data,
            'labels': labels
        })

    return jsonify(response_data)

nome_meses = ["",  # Deixando o índice 0 vazio, já que os meses começam do índice 1
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

@app.route('/relatorio/pdf', methods=['GET'])
def generate_pdf():
    # Recebendo o mês via parâmetro (exemplo: '2024-10')
    mes = request.args.get('month', type=str)

    # Convertendo o mês para o nome completo do mês (exemplo: "Outubro" para "2024-10")
    ano = mes[:4]
    numero_mes = int(mes[5:])
    nome_mes = nome_meses[numero_mes]  # Exemplo: "October" para o mês 10
    mes_nome = f"{nome_mes} de {ano}"  # Exemplo: "Outubro de 2024"

    # Conexão com o banco de dados
    conn = get_db_connection()
    cursor = conn.cursor()

    # Ajustando a consulta SQL para filtrar pelo mês e ano (usando YEAR() e MONTH())
    cursor.execute("""
        SELECT Mercadorias.nome, 
               COALESCE(SUM(Entradas.quantidade), 0), 
               COALESCE(SUM(Saidas.quantidade), 0)
        FROM Mercadorias
        LEFT JOIN Entradas ON Mercadorias.id = Entradas.mercadoria_id 
        AND YEAR(Entradas.data_hora) = %s 
        AND MONTH(Entradas.data_hora) = %s
        LEFT JOIN Saidas ON Mercadorias.id = Saidas.mercadoria_id
        AND YEAR(Saidas.data_hora) = %s 
        AND MONTH(Saidas.data_hora) = %s
        GROUP BY Mercadorias.id
    """, (mes[:4], mes[5:], mes[:4], mes[5:]))  # Passando o ano e mês separados

    # Recuperando os dados
    data = cursor.fetchall()
    conn.close()

    # Preparando dados para tabela
    table_data = [["Mercadoria", "Entradas", "Saídas"]]  # Cabeçalho da tabela
    for row in data:
        table_data.append([row[0], row[1], row[2]])

    # Gerando o PDF com a tabela
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)

    # Criando título no PDF
    elements = []

    # Adicionando um título simples como elemento
    title = Paragraph(f"Relatório {mes_nome}", style=ParagraphStyle(name="Title", fontName="Helvetica-Bold", fontSize=14))
    elements.append(title)

    # Adicionando um Spacer para dar espaço entre o título e a tabela
    elements.append(Spacer(1, 20))  # 20 é a altura do espaço entre título e tabela

    # Definindo a tabela com 3 colunas e uma largura proporcional
    table = Table(table_data, colWidths=[doc.width / 3.0] * len(table_data[0]))

    # Definindo o estilo da tabela
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('LINEBEFORE', (0, 0), (0, -1), 1, colors.black),
        ('LINEAFTER', (-1, 0), (-1, -1), 1, colors.black),
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.black),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)

    # Adicionando a tabela no documento
    elements.append(table)

    # Gerando o documento
    doc.build(elements)

    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name=f"relatorio_{mes}.pdf", mimetype="application/pdf")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
