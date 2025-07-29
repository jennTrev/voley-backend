import { Router } from "express"
import {
  obtenerEntrenadores,
  obtenerEntrenador,
  crearEntrenador,
  actualizarEntrenador,
  eliminarEntrenador,
} from "../controllers/entrenadorController.js"
import { autenticar, autorizar } from "../middlewares/auth.js"
import { validarEntrenador, validarId } from "../middlewares/validations.js"

const router = Router()

router.use(autenticar)
router.use(autorizar("tecnico"))

router.get("/", obtenerEntrenadores)
router.get("/:id", validarId, obtenerEntrenador)
router.post("/", validarEntrenador, crearEntrenador)
router.put("/:id", validarId, validarEntrenador, actualizarEntrenador)
router.delete("/:id", validarId, eliminarEntrenador)

export default router
