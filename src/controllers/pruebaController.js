import { Prueba } from "../models/Prueba.js";
import { Cuenta } from "../models/Cuenta.js";
import { Jugador } from "../models/Jugador.js";
import { Entrenador } from "../models/Entrenador.js";
import { Tecnico } from "../models/Tecnico.js";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1978430",
  key: "4f85ef5c792df94cebc9",
  secret: "351840445857a008668f",
  cluster: "us2",
  useTLS: true,
});

// Función auxiliar para enviar comandos a todos los ESP
const enviarComandoATodos = async (comando, deviceIds = [1, 2, 3, 4, 5], userId = "sistema") => {
  for (const id of deviceIds) {
    const channel = `esp-${id}`;
    await pusher.trigger(channel, "command", {
      command: comando,
      userId,
      timestamp: new Date().toISOString(),
    });
    console.log(`Comando "${comando}" enviado a ESP-${id} por usuario ${userId}`);
  }
};

// Iniciar prueba
export const iniciarPrueba = async (req, res) => {
  try {
    const { tipo, cuentaId } = req.body;

    if (!tipo || !cuentaId) {
      return res.status(400).json({ success: false, message: "Tipo de prueba y cuentaId son requeridos" });
    }

    // Crear la prueba con estado "en_curso"
    const nuevaPrueba = await Prueba.create({
      tipo,
      cuentaId,
      tiempo_inicio: new Date(),
      estado: "en_curso", // Establecer estado como "en_curso"
    });

    // Definir comando inicial según tipo de prueba
    let comandoInicial = "";
    switch (tipo) {
      case "secuencial":
        comandoInicial = "S"; // modo secuencial
        break;
      case "aleatorio":
        comandoInicial = "R"; // modo aleatorio
        break;
      case "manual":
        comandoInicial = "M"; // modo manual
        break;
      default:
        comandoInicial = "X";
    }

    // Enviar comando a todos los microcontroladores
    await enviarComandoATodos(comandoInicial, [1, 2, 3, 4, 5], cuentaId);

    res.json({ success: true, data: nuevaPrueba, message: `Prueba iniciada con comando "${comandoInicial}"` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al iniciar la prueba", error: error.message });
  }
};

// Finalizar prueba
export const finalizarPrueba = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body; // aciertos, errores, tiempo_final, cantidad_intentos, ejercicios_realizados, etc.

    const prueba = await Prueba.findByPk(id);
    if (!prueba) {
      return res.status(404).json({ success: false, message: "Prueba no encontrada" });
    }

    // Enviar comando "F" para indicar que la prueba finalizó
    await enviarComandoATodos("F", [1, 2, 3, 4, 5], prueba.cuentaId);

    // Actualizar campos según tipo de prueba
    if (prueba.tipo === "secuencial" || prueba.tipo === "manual") {
      datos.tiempo_fin = datos.tiempo_fin || new Date();
    }

    // Actualizar el estado a "finalizada"
    await prueba.update({
      ...datos,
      estado: "finalizada", // Establecer estado como "finalizada"
    });

    res.json({ success: true, data: prueba, message: "Prueba finalizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al finalizar la prueba", error: error.message });
  }
};

// Obtener todas las pruebas finalizadas
export const obtenerPruebas = async (req, res) => {
  try {
    const pruebas = await Prueba.findAll({
      where: { estado: "finalizada" }, // Filtrar solo pruebas finalizadas
      include: [
        {
          model: Cuenta,
          attributes: { exclude: ["password"] },
          include: [
            { model: Jugador, as: "jugador" },
            { model: Entrenador, as: "entrenador" },
            { model: Tecnico, as: "tecnico" },
          ],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    res.json({ success: true, data: pruebas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener pruebas", error: error.message });
  }
};

// Obtener pruebas finalizadas por usuario
export const obtenerPruebasPorUsuario = async (req, res) => {
  try {
    const { cuentaId } = req.params;

    const pruebas = await Prueba.findAll({
      where: { cuentaId, estado: "finalizada" }, // Filtrar solo pruebas finalizadas por cuentaId
      include: [
        {
          model: Cuenta,
          attributes: { exclude: ["password"] },
          include: [
            { model: Jugador, as: "jugador" },
            { model: Entrenador, as: "entrenador" },
            { model: Tecnico, as: "tecnico" },
          ],
        },
      ],
      order: [["fecha", "DESC"]],
    });

    res.json({ success: true, data: pruebas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener pruebas por usuario", error: error.message });
  }
};

// Eliminar prueba
export const eliminarPrueba = async (req, res) => {
  try {
    const { id } = req.params;

    const prueba = await Prueba.findByPk(id);
    if (!prueba) {
      return res.status(404).json({ success: false, message: "Prueba no encontrada" });
    }

    await prueba.destroy();
    res.json({ success: true, message: "Prueba eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al eliminar prueba", error: error.message });
  }
};
