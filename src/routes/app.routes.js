import { Router } from "express";
import { controller } from "../controllers/app.controller";

const router = Router();

router.get('/', controller.inicio);
router.post('/principal', controller.principal);
router.post('/registrar', controller.registrar);
router.post('/registro/:id', controller.registro);
router.get('/cuenta/:id', controller.cuenta);
router.get('/transferencia/:id', controller.transferencia);
router.post('/transferir/:dpi/:id', controller.transferir);
router.get('/estado/:id', controller.estado);
router.get('/clientes', controller.clientes);
router.get('/asignar', controller.asignar);
router.post('/asignarCuenta', controller.asignarCuenta);

export default router;