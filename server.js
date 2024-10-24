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

async function connectToDatabase() {
    try {
        const connection = await odbc.connect(DSN);
        console.log('Conexión a la base de datos exitosa');
        return connection;
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        throw error;
    }
}

// obtener todos los datos de la base de datos
app.get('/todos', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const result = await connection.query('SELECT Id, TaskText, Completed FROM Todos');
        const todos = result.map(todo => ({
            Id: todo.Id,
            TaskText: todo.TaskText,
            Completed: todo.Completed === 1  
        }));
        res.json(todos);
    } catch (error) {
        res.status(500).send('Error retrieving todos');
    }
});




//agregar una nueva tarea
app.post('/todos', async (req, res) => {
    let { text, completed } = req.body;
    completed = completed ? 1 : 0;  
    try {
        const connection = await connectToDatabase();
        const sql = `INSERT INTO Todos (TaskText, Completed) VALUES ('${text}', ${completed})`;
        const result = await connection.query(sql);
        res.json({ text, completed });
    } catch (error) {
        res.status(500).send(`Error adding todo: ${error.message}`);
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
    const { text, completed } = req.body;
    try {
        const connection = await connectToDatabase();
        const sql = `UPDATE Todos SET TaskText='${text}', Completed=${completed ? 1 : 0} WHERE Id=${id}`;
        await connection.query(sql);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(`Error updating todo: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});