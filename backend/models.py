import pymysql
from config import db_config

def get_db_connection():
    return pymysql.connect(**db_config)

def fetch_all_mercadorias():
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM Mercadorias")
        mercadorias = cursor.fetchall()
    conn.close()
    return mercadorias

def add_mercadoria(data):
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = """
        INSERT INTO Mercadorias (nome, numero_registro, fabricante, tipo, descricao)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (data['nome'], data['numero_registro'], data['fabricante'], data['tipo'], data['descricao']))
        conn.commit()
    conn.close()
