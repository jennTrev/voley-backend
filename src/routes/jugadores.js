import { Router } from "express"
import { obtenerJugadores, obtenerJugador, actualizarJugador } from "../controllers/jugadorController.js"
import { autenticar, autorizar } from "../middlewares/auth.js"
import { validarJugador, validarId } from "../middlewares/validations.js"

const router = Router()

router.use(autenticar)

router.get("/", autorizar("entrenador", "tecnico"), obtenerJugadores)
router.get("/:id", validarId, obtenerJugador)
router.put("/:id", validarId, validarJugador, actualizarJugador)

export default router
