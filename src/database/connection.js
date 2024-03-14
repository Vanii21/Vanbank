import oracledb from 'oracledb';

const dbSettings = {
    user: 'vanii',
    password: '1234',
    connectString: '0.tcp.ngrok.io:11887/UMG',
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