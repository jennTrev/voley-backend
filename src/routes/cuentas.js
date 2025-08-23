import { Router } from "express"
import { obtenerCuentas, crearCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentaController.js"
import { autenticar } from "../middlewares/auth.js" // opcional, si quieres quitar autenticación
import { validarCuenta, validarId } from "../middlewares/validations.js"

const router = Router()


// 🔹 Rutas sin permisos
router.get("/", obtenerCuentas)
router.post("/", validarCuenta, crearCuenta)
router.put("/:id", validarId, actualizarCuenta)
router.delete("/:id", validarId, eliminarCuenta)

export default router
