import { Prueba } from "../models/Prueba.js"
import { Cuenta } from "../models/Cuenta.js"
import { Jugador } from "../models/Jugador.js"
import { Entrenador } from "../models/Entrenador.js"
import { Tecnico } from "../models/Tecnico.js"
import Pusher from "pusher"

const pusher = new Pusher({
  appId: "1978430",
  key: "4f85ef5c792df94cebc9",
  secret: "351840445857a008668f",
  cluster: "us2",
  useTLS: true,
})

// Función para enviar comando a dispositivos con deviceIds con prefijo "ESP-"
const enviarComandoATodos = async (comando, deviceIds = ["ESP-1", "ESP-2", "ESP-3", "ESP-4", "ESP-5"], userId = "sistema") => {
  for (const id of deviceIds) {
    const channel = `private-device-${id}` // Ejemplo: private-device-ESP-2
    await pusher.trigger(channel, "client-command", {
      command: comando,
      from: userId,
      timestamp: new Date().toISOString(),
    })
    console.log(`Comando "${comando}" enviado a ${id} por usuario ${userId}`)
  }
}

export const sendCommand = async (req, res) => {
  try {
    const { deviceId, command } = req.body;

    if (!deviceId || !command) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    // Asegurar que deviceId tenga prefijo "ESP-" (si no, agregarlo)
    const normalizedDeviceId = deviceId.startsWith("ESP-") ? deviceId : `ESP-${deviceId}`;

    const channel = `private-device-${normalizedDeviceId}`;

    await pusher.trigger(channel, 'client-command', {
      command: command,
      from: 'server'
    });

    res.json({ success: true, message: `Comando '${command}' enviado al dispositivo ${normalizedDeviceId}` });
  } catch (error) {
    console.error('Error enviando comando:', error);
    res.status(500).json({ error: 'Error enviando comando' });
  }
};

// ------------------ CONTROLADORES ------------------ //

// Iniciar prueba
export const iniciarPrueba = async (req, res) => {
  try {
    const { tipo, cuentaId } = req.body
    if (!tipo || !cuentaId)
      return res.status(400).json({ success: false, message: "Tipo de prueba y cuentaId son requeridos" })

    const nuevaPrueba = await Prueba.create({
      tipo,
      cuentaId,
      tiempo_inicio: new Date(),
      fecha: new Date(),
      estado: "en_curso",
    })

    // Determinar comando inicial según tipo
    const comandoInicial = tipo === "secuencial" ? "ON" : tipo === "aleatorio" ? "R" : tipo === "manual" ? "M" : "X"

    // Enviar comando a los dispositivos con deviceIds con prefijo "ESP-"
    const deviceIds = ["ESP-1", "ESP-2", "ESP-3", "ESP-4", "ESP-5"];
    for (const deviceId of deviceIds) {
      const channel = `private-device-${deviceId}`
      await pusher.trigger(channel, "client-command", {
        command: comandoInicial,
        from: "server",
      })
      console.log(`Comando "${comandoInicial}" enviado al dispositivo ${deviceId}`)
    }

    res.json({ success: true, data: nuevaPrueba, message: `Prueba iniciada con comando "${comandoInicial}"` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error al iniciar la prueba", error: error.message })
  }
}

// Finalizar prueba
export const finalizarPrueba = async (req, res) => {
  try {
    const { id } = req.params
    const datos = req.body

    const prueba = await Prueba.findByPk(id)
    if (!prueba) return res.status(404).json({ success: false, message: "Prueba no encontrada" })

    // Enviar comando "F" a todos los dispositivos con prefijo "ESP-"
    await enviarComandoATodos("F", ["ESP-1", "ESP-2", "ESP-3", "ESP-4", "ESP-5"], prueba.cuentaId)

    if (prueba.tipo === "secuencial" || prueba.tipo === "manual") {
      datos.tiempo_fin = datos.tiempo_fin || new Date()
    }

    await prueba.update({ ...datos, estado: "finalizada" })

    res.json({ success: true, data: prueba, message: "Prueba finalizada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error al finalizar la prueba", error: error.message })
  }
}

// ... (el resto de controladores se mantienen igual)


// Obtener todas las pruebas finalizadas
export const obtenerPruebas = async (req, res) => {
  try {
    const pruebas = await Prueba.findAll({
      where: { estado: "finalizada" },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          attributes: { exclude: ["contraseña", "token"] },
          include: [
            { model: Jugador, as: "jugador", attributes: ["nombres", "apellidos"] },
            { model: Entrenador, as: "entrenador", attributes: ["nombres", "apellidos"] },
            { model: Tecnico, as: "tecnico", attributes: ["nombres", "apellidos"] },
          ],
        },
      ],
      order: [["tiempo_fin", "DESC"]],
    })

    const pruebasFormateadas = pruebas.map((prueba) => {
      const { tipo, tiempo_inicio, tiempo_fin, cantidad_aciertos, cantidad_errores, fecha } = prueba
      const nombre =
        prueba.cuenta.rol === "jugador"
          ? `${prueba.cuenta.jugador.nombres} ${prueba.cuenta.jugador.apellidos}`
          : prueba.cuenta.rol === "entrenador"
            ? `${prueba.cuenta.entrenador.nombres} ${prueba.cuenta.entrenador.apellidos}`
            : `${prueba.cuenta.tecnico.nombres} ${prueba.cuenta.tecnico.apellidos}`

      return {
        id: prueba.id,
        tipo,
        fecha,
        tiempo_inicio,
        tiempo_fin,
        cantidad_aciertos,
        cantidad_errores,
        jugador: nombre,
      }
    })

    res.json({ success: true, data: pruebasFormateadas })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error al obtener pruebas", error: error.message })
  }
}

// Obtener pruebas finalizadas por usuario
export const obtenerPruebasPorUsuario = async (req, res) => {
  try {
    const { cuentaId } = req.params

    const pruebas = await Prueba.findAll({
      where: { cuentaId, estado: "finalizada" },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          attributes: { exclude: ["contraseña", "token"] },
          include: [
            { model: Jugador, as: "jugador", attributes: ["nombres", "apellidos"] },
            { model: Entrenador, as: "entrenador", attributes: ["nombres", "apellidos"] },
            { model: Tecnico, as: "tecnico", attributes: ["nombres", "apellidos"] },
          ],
        },
      ],
      order: [["tiempo_fin", "DESC"]],
    })

    const pruebasFormateadas = pruebas.map((prueba) => {
      const { tipo, tiempo_inicio, tiempo_fin, cantidad_aciertos, cantidad_errores, fecha } = prueba
      const nombre =
        prueba.cuenta.rol === "jugador"
          ? `${prueba.cuenta.jugador.nombres} ${prueba.cuenta.jugador.apellidos}`
          : prueba.cuenta.rol === "entrenador"
            ? `${prueba.cuenta.entrenador.nombres} ${prueba.cuenta.entrenador.apellidos}`
            : `${prueba.cuenta.tecnico.nombres} ${prueba.cuenta.tecnico.apellidos}`

      return {
        id: prueba.id,
        tipo,
        fecha,
        tiempo_inicio,
        tiempo_fin,
        cantidad_aciertos,
        cantidad_errores,
        jugador: nombre,
      }
    })

    res.json({ success: true, data: pruebasFormateadas })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error al obtener pruebas por usuario", error: error.message })
  }
}

// Eliminar prueba
export const eliminarPrueba = async (req, res) => {
  try {
    const { id } = req.params
    const prueba = await Prueba.findByPk(id)
    if (!prueba) return res.status(404).json({ success: false, message: "Prueba no encontrada" })

    await prueba.destroy()
    res.json({ success: true, message: "Prueba eliminada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error al eliminar prueba", error: error.message })
  }
}