const odbc = require('odbc');

const connectionString = 'DSN=MiDSNAccess;';


async function testConnection() {
    try {
        const connection = await odbc.connect(connectionString);
        console.log('Conexión exitosa');
        await connection.close();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}


async function testInsert() {
    try {
        const connection = await odbc.connect(connectionString);
        const text = 'Prueba de tarea tres';
        const completed = 1;
        const query = `INSERT INTO [Todos] ([Text], [Completed]) VALUES ('${text.replace(/'/g, "''")}', ${completed})`; // Asegúrate de usar corchetes para nombres de columnas
        await connection.query(query);
        await connection.close();
        console.log('Inserción exitosa');
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
    }
}


testConnection();
testInsert();
