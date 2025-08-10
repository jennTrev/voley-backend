import { Router } from "express"
import {
  obtenerJugadores,
  obtenerJugador,
  crearJugador,
  actualizarJugador
} from "../controllers/jugadorController.js"
import { autenticar, autorizar } from "../middlewares/auth.js"
import { validarJugador, validarId } from "../middlewares/validations.js"

const router = Router()

// 🔹 Autenticación obligatoria para todas las rutas
router.use(autenticar)

// 🔹 Obtener todos los jugadores (solo entrenador o técnico)
router.get("/", autorizar("entrenador", "tecnico"), obtenerJugadores)

// 🔹 Obtener un jugador por ID
router.get("/:id", validarId, obtenerJugador)

// 🔹 Crear un nuevo jugador
router.post("/", autorizar("entrenador"), validarJugador, crearJugador)

// 🔹 Actualizar jugador
router.put("/:id", validarId, validarJugador, actualizarJugador)

export default router
