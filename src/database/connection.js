import oracledb from 'oracledb';

const dbSettings = {
    user: 'vanii',
    password: '1234',
    connectString: 'io.tcp.ngrok.io:12792/UMG',
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