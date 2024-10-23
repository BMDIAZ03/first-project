const express = require('express');
const bodyParser = require('body-parser');
const odbc = require('odbc');
const path = require('path');
const app = express();
const port = 5500;
const connectionString = 'DSN=MiDSNAccess;';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/test-connection', async (req, res) => {
    try {
        const connection = await odbc.connect(connectionString);
        await connection.close();
        res.status(200).json({ message: 'Conexión exitosa' });
    } catch (error) {
        console.error('Error de conexión:', error.message);
        res.status(500).json({ error: `Error de conexión: ${error.message}` });
    }
}); 

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/todos', async (req, res) => {
    try {
        const connection = await odbc.connect(connectionString);
        const result = await connection.query('SELECT * FROM Todos');
        await connection.close();
        res.json(result);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ error: `Error al obtener datos: ${error.message}` });
    }
});

app.post('/todos', async (req, res) => {
    const { text, completed } = req.body;
    try {
        const connection = await odbc.connect(connectionString);
        const escapedText = text.replace(/'/g, "''"); // Escapar comillas simples
        const query = `INSERT INTO [Todos] ([Text], [Completed]) VALUES ('${escapedText}', ${completed ? 1 : 0})`;
        await connection.query(query);
        const result = await connection.query('SELECT * FROM Todos WHERE [Text] = ? AND [Completed] = ?', [escapedText, completed]);
        await connection.close();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al añadir tarea:', error.message);
        res.status(500).json({ error: `Error al añadir tarea: ${error.message}` });
    }
});


app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params.id;
    try {
        const connection = await odbc.connect(connectionString);
        const query = `DELETE FROM [Todos] WHERE Id = ${id}`;
        await connection.query(query);
        await connection.close();
        res.status(200).json({ message: 'Tarea eliminada' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: `Error al eliminar tarea: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
