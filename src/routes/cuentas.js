import { Router } from "express"
import { obtenerCuentas, crearCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentaController.js"
import { autenticar, autorizar } from "../middlewares/auth.js"
import { validarCuenta, validarId } from "../middlewares/validations.js"

const router = Router()

router.use(autenticar)
router.use(autorizar("tecnico"))

router.get("/", obtenerCuentas)
router.post("/", validarCuenta, crearCuenta)
router.put("/:id", validarId, actualizarCuenta)
router.delete("/:id", validarId, eliminarCuenta)

export default router
