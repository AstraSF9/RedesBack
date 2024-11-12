// Importa dependencias
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')

const app = express();
const PORT = 3000;

// Middleware para leer JSON en las solicitudes
app.use(express.json());
app.use(cors());

// Configura la conexión a la base de datos con los parámetros proporcionados directamente
const db = mysql.createConnection({
    host: 'localhost',      // Dirección IP de la computadora remota donde está la BD
    user: 'usuprueba',         // Nombre de usuario
    password: '12345',         // Contraseña del usuario
    database: 'tpfinal', // Reemplaza con el nombre de tu base de datos
    port: 3306                 // Puerto por defecto de MySQL
});

// Conecta a la base de datos y maneja errores de conexión
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta POST para recibir datos
app.post('/api/datos', (req, res) => {
    const { nombre, apellido, dni } = req.body;
    
    // Validar datos
    if (!nombre || !apellido || !dni) {
        return res.status(400).json({ mensaje: "Faltan datos" });
    }

    // Consulta para insertar datos en la base de datos
    const query = 'INSERT INTO usuarios (nombre, apellido, dni) VALUES (?, ?, ?)';
    db.query(query, [nombre, apellido, dni], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            return res.status(500).json({ mensaje: 'Error al insertar datos' });
        }
        res.json({ mensaje: "Datos guardados correctamente", id: result.insertId });
    });
});

app.get('/api/usuarios', (req, res) => {
    // Recupera los usuarios de la base de datos
    const query = 'SELECT nombre, apellido, dni FROM usuarios';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
