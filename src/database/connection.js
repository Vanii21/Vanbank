import oracledb from 'oracledb';

const dbSettings = {
    user: 'VDB',
    password: '1234',
    connectString: '2.tcp.ngrok.io:13266/xe',
    database: 'VaniiDB',
}

export async function connectiondb(){
    try {
        const pool = await oracledb.getConnection(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}