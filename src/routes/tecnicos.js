import { Router } from "express"
import {
  obtenerTecnicos,
  obtenerTecnico,
  crearTecnico,
  actualizarTecnico,
  eliminarTecnico,
} from "../controllers/tecnicoController.js"
import { autenticar, autorizar } from "../middlewares/auth.js"
import { validarTecnico, validarId } from "../middlewares/validations.js"

const router = Router()

router.use(autenticar)
router.use(autorizar("tecnico"))

router.get("/", obtenerTecnicos)
router.get("/:id", validarId, obtenerTecnico)
router.post("/", validarTecnico, crearTecnico)
router.put("/:id", validarId, validarTecnico, actualizarTecnico)
router.delete("/:id", validarId, eliminarTecnico)

export default router
