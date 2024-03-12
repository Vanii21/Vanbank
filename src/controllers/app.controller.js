import { connectiondb } from "../database/connection";
import oracledb from "oracledb";

export const controller = {};

//Cargar el login 
controller.inicio = (req, res) => {
    res.render('index');
};

//Iniciar Sesion
controller.principal = async (req, res) => {
    const { txtUsuario, txtContrasena } = req.body;
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN PRINCIPAL(:txtUsuario, :txtContrasena, :usuario); END;', {txtUsuario: txtUsuario, txtContrasena: txtContrasena, usuario: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    //getRows porque asi el .length devuelve 0, de lo contrario daria undefined
    const existeUsuario = await result.outBinds.usuario.getRows();
    if (existeUsuario.length !== 0){
        const dato = existeUsuario[0];
        const resultA = await pool.execute('BEGIN ADMINU(:admins); END;', { admins: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
        const datoA = await resultA.outBinds.admins.getRow();
        if (dato[1] === datoA[0] && dato[2] === datoA[1]) {
            res.render('administracion', {datoA});
        } else{
            console.log(dato);
            res.render('principal', { dato });
        }
    } else {
        res.redirect('/');
    }
};

//Registrar un usuario
controller.registrar = async (req, res) => {
    const { txtUsuario, txtContrasena } = req.body;
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN USUARIOC(:txtUsuario, :usuario); END;', {txtUsuario: txtUsuario, usuario: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const existe = await result.outBinds.usuario.getRows();
    if (existe.length === 1){
        res.redirect('/');
    } else {
        await pool.execute('BEGIN USUARIOR(:txtUsuario, :txtContrasena); END;', {txtUsuario: txtUsuario, txtContrasena: txtContrasena});
        const usuario = await pool.execute('BEGIN USUARIOC(:txtUsuario, :usuario); END;', {txtUsuario: txtUsuario, usuario: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
        const id =  await usuario.outBinds.usuario.getRow();
        res.render('registro', {id});
    }
};

//Registrar una cuenta
controller.registro = async (req, res) => {
    const { txtDpi, txtNombre, txtApellido, txtF_Nacimiento, txtResidencia, txtTelefono } = req.body;
    const { id } = req.params;
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN CLIENTEC(:txtDPI, :cliente); END;', {txtDPI: txtDpi, cliente: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const existe = await result.outBinds.cliente.getRows();
    if (existe.length === 1){
        res.render('registro');
    } else {
        await pool.execute('BEGIN CLIENTER(:txtDPI, :txtNombre, :txtApellido, :txtF_Nacimiento, :txtResidencia, :txtTelefono, :txtId); END;', {txtDPI: txtDpi, txtNombre: txtNombre, txtApellido: txtApellido, txtF_Nacimiento: txtF_Nacimiento, txtResidencia: txtResidencia, txtTelefono: txtTelefono, txtId: id});
        pool.close();
        res.render('index');
    }
};

//Mostrar cuentas que tiene el usuario
controller.cuenta = async (req, res) => {
    const { id } = req.params
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN CUENTAC(:txtId, :cuenta); END;', {txtId: id, cuenta: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsCuentas = await result.outBinds.cuenta.getRows();
    res.render('cuenta', {rowsCuentas});
};

//Mostrar cuentas en la vista transferencia
controller.transferencia = async (req, res) => {
    const { id } = req.params
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN ORIGENC(:txtId, :origen); END;', {txtId: id, origen: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const result2 = await pool.execute('BEGIN DESTINOC(:destino); END;', {destino: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsOrigen = await result.outBinds.origen.getRows();
    const rowsDestino = await result2.outBinds.destino.getRows();
    res.render('transferencia', {rowsOrigen, rowsDestino});
};

//Realizar transferencia
controller.transferir = async (req, res) => {
    const { monto, cuenta_destino, cuenta_origen, descripcion } = req.body
    const { dpi, id } = req.params
    const pool = await connectiondb();
    await pool.execute('BEGIN TRANSACCION(:MONTO, :CUENTA_DEST, :CUENTA_ORIG, :DESCRIPCION, :CLIENTE_DPI); END;', {MONTO: monto, CUENTA_DEST: cuenta_destino, CUENTA_ORIG: cuenta_origen, DESCRIPCION: descripcion, CLIENTE_DPI: dpi});
    const result = await pool.execute('BEGIN ORIGENC(:txtId, :origen); END;', {txtId: id, origen: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const result2 = await pool.execute('BEGIN DESTINOC(:destino); END;', {destino: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsOrigen = await result.outBinds.origen.getRows();
    const rowsDestino = await result2.outBinds.destino.getRows();
    res.render('transferencia', {rowsOrigen, rowsDestino});
};

//Mostrar el estado de movimiento de esa cuenta
controller.estado = async(req, res) => {
    const { id } = req.params
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN ESTADODC(:txtId, :estadod); END;', {txtId: id, estadod: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const result2 = await pool.execute('BEGIN ESTADOCC(:txtId, :estadoc); END;', {txtId: id, estadoc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsDebito = await result.outBinds.estadod.getRows();
    const rowsCredito = await result2.outBinds.estadoc.getRows();
    res.render('estado', {rowsDebito, rowsCredito});
};

// -----------ADMINSTRACION---------------

controller.clientes = async(req, res) => {
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN CLIENTESC(:clientes); END;', {clientes: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsClientes = await result.outBinds.clientes.getRows();
    res.render('cliente', {rowsClientes});
};

controller.asignar = async (req, res) => {
    const pool = await connectiondb();
    const result = await pool.execute('BEGIN CLIENTESSC(:clientesc); END;', {clientesc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsClientes = await result.outBinds.clientesc.getRows();
    res.render('asignar', {rowsClientes});
}

controller.asignarCuenta = async (req, res) => {
    const { txtNoCuenta, txtSaldo, txtTipoCuenta, txtDpi } = req.body;
    const saldo = parseFloat(txtSaldo);
    const pool = await connectiondb();
    await pool.execute('BEGIN CUENTASR(:txtNoCuenta, :txtSaldo, :txtTipoCuenta, :txtDpi); END;', {txtNoCuenta: txtNoCuenta, txtSaldo: saldo, txtTipoCuenta: txtTipoCuenta, txtDpi: txtDpi});
    const result = await pool.execute('BEGIN CLIENTESSC(:clientesc); END;', {clientesc: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }});
    const rowsClientes = await result.outBinds.clientesc.getRows();
    res.render('asignar', {rowsClientes});
}