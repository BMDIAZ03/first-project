const express = require('express');
const bodyParser = require('body-parser');
const odbc = require('odbc');
const path = require('path');


const app = express();
const port = 5500;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//const connectionString = 'DSN=MiDSNAccess;';
const DSN = 'DSN=MiDSNAccess;';


app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi aplicación de tareas!');
});


//conecion a la base de datos
async function connectToDatabase() {
    try {
        const connection = await odbc.connect(DSN);
        console.log('Database connected successfully');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

// obtener todos los datos de la base de datos
app.get('/todos', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await connection.query('SELECT * FROM Todos');
        res.json(result);
    } catch (error) {
        res.status(500).send('Error retrieving todos');
    }
});

//agregar una nueva tarea
app.post('/todos', async (req, res) => {
    const { text, completed } = req.body;
    try {
        const connection = await connectToDatabase();
        const result = await connection.query(`INSERT INTO Todos (Text, Completed) VALUES ('${text}', ${completed})`);
        res.json({ id: result.insertId, text, completed });
    } catch (error) {
        res.status(500).send('Error adding todo');
    }
});

//eliminar una tarea pendiente
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await connectToDatabase();
        await connection.query(`DELETE FROM Todos WHERE Id=${id}`);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Error deleting todo');
    }
});

// editar una tarea
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const connection = await connectToDatabase();
        await connection.query(`UPDATE Todos SET Text='${text}' WHERE Id=${id}`);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Error updating todo');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

/*app.get('/test-connection', async (req, res) => {
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
        const escapedText = text.replace(/'/g, "''"); 
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
});*/
