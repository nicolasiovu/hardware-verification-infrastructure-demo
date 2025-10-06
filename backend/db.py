import os
from mysql.connector import connect, Error
from fastapi import HTTPException
from datetime import datetime

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "fastapi",
    "password": "testpassword",
    "database": "test_runner_db"
}

def get_db_connection():
    try:
        conn = connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

def init_db():
    """Initialize database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create Batch table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Batch (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            date DATETIME NOT NULL,
            is_complete BOOLEAN DEFAULT FALSE
        )
    """)
    
    # Create Test table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Test (
            id INT AUTO_INCREMENT PRIMARY KEY,
            batch_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            timestamp DATETIME NOT NULL,
            status ENUM('pass', 'fail') NOT NULL,
            runtime FLOAT NOT NULL,
            failure_reason TEXT,
            FOREIGN KEY (batch_id) REFERENCES Batch(id) ON DELETE CASCADE
        )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
