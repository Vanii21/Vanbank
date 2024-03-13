import oracledb from 'oracledb';

const dbSettings = {
    user: 'VDB',
    password: '1234',
    connectString: '0.tcp.ngrok.io:16727/xe',
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