import { Router } from "express"
import { obtenerCuentas, obtenerCuenta, crearCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentaController.js"
import { validarCuenta, validarId } from "../middlewares/validations.js"

const router = Router()

// 🔹 Rutas sin permisos
router.get("/", obtenerCuentas)
router.get("/:id", validarId, obtenerCuenta)  // ← nuevo
router.post("/", validarCuenta, crearCuenta)
router.put("/:id", validarId, actualizarCuenta)
router.delete("/:id", validarId, eliminarCuenta)

export default router
