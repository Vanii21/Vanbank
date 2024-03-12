import oracledb from 'oracledb';

const dbSettings = {
    user: 'VDB',
    password: '1234',
    connectString: '3.134.238.10:1521',
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