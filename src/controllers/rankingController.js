import { Op } from "sequelize";
import { Prueba } from "../models/Prueba.js";
import { Cuenta, Jugador, Entrenador, Tecnico } from "../models/index.js";

// Ranking personal de todos los tiempos
export const rankingPersonal = async (req, res) => {
  try {
    const { cuentaId } = req.params;

    // Obtener todas las pruebas finalizadas de un usuario
    const pruebas = await Prueba.findAll({
      where: { estado: "finalizada", cuentaId },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          attributes: ["rol"],
          include: [
            { model: Jugador, as: "jugador", attributes: ["nombres", "apellidos"] },
            { model: Entrenador, as: "entrenador", attributes: ["nombres", "apellidos"] },
            { model: Tecnico, as: "tecnico", attributes: ["nombres", "apellidos"] },
          ],
        },
      ],
      order: [["tiempo_fin", "DESC"]],
    });

    const ranking = {
      secuencial: [],
      aleatorio: [],
      manual: [],
    };

    pruebas.forEach((prueba) => {
      const { tipo, tiempo_inicio, tiempo_fin, cantidad_aciertos, cantidad_errores } = prueba;
      const tiempo = tiempo_fin - tiempo_inicio;

      let nombre = "";
      const cuenta = prueba.cuenta;
      if (cuenta.rol === "jugador" && cuenta.jugador) {
        nombre = `${cuenta.jugador.nombres} ${cuenta.jugador.apellidos}`;
      } else if (cuenta.rol === "entrenador" && cuenta.entrenador) {
        nombre = `${cuenta.entrenador.nombres} ${cuenta.entrenador.apellidos}`;
      } else if (cuenta.rol === "tecnico" && cuenta.tecnico) {
        nombre = `${cuenta.tecnico.nombres} ${cuenta.tecnico.apellidos}`;
      }

      if (tipo === "secuencial") {
        ranking.secuencial.push({ jugador: nombre, tiempo, cantidad: 1 });
      } else if (tipo === "aleatorio") {
        ranking.aleatorio.push({ jugador: nombre, tiempo, cantidad_aciertos, cantidad_errores });
      } else if (tipo === "manual") {
        ranking.manual.push({ jugador: nombre, tiempo, cantidad_aciertos, cantidad_errores });
      }
    });

    ranking.secuencial.sort((a, b) => a.tiempo - b.tiempo);
    ranking.aleatorio.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);
    ranking.manual.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);

    res.json({ success: true, data: ranking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener ranking personal", error: error.message });
  }
};

// Ranking general de todos los tiempos
export const rankingGeneral = async (req, res) => {
  try {
    const pruebas = await Prueba.findAll({
      where: { estado: "finalizada" },
      include: [
        {
          model: Cuenta,
          as: "cuenta",
          attributes: ["rol"],
          include: [
            { model: Jugador, as: "jugador", attributes: ["nombres", "apellidos"] },
            { model: Entrenador, as: "entrenador", attributes: ["nombres", "apellidos"] },
            { model: Tecnico, as: "tecnico", attributes: ["nombres", "apellidos"] },
          ],
        },
      ],
      order: [["tiempo_fin", "DESC"]],
    });

    const ranking = {
      secuencial: [],
      aleatorio: [],
      manual: [],
    };

    pruebas.forEach((prueba) => {
      const { tipo, tiempo_inicio, tiempo_fin, cantidad_aciertos, cantidad_errores } = prueba;
      const tiempo = tiempo_fin - tiempo_inicio;

      let nombre = "";
      const cuenta = prueba.cuenta;
      if (cuenta.rol === "jugador" && cuenta.jugador) {
        nombre = `${cuenta.jugador.nombres} ${cuenta.jugador.apellidos}`;
      } else if (cuenta.rol === "entrenador" && cuenta.entrenador) {
        nombre = `${cuenta.entrenador.nombres} ${cuenta.entrenador.apellidos}`;
      } else if (cuenta.rol === "tecnico" && cuenta.tecnico) {
        nombre = `${cuenta.tecnico.nombres} ${cuenta.tecnico.apellidos}`;
      }

      if (tipo === "secuencial") {
        ranking.secuencial.push({ jugador: nombre, tiempo, cantidad: 1 });
      } else if (tipo === "aleatorio") {
        ranking.aleatorio.push({ jugador: nombre, tiempo, cantidad_aciertos, cantidad_errores });
      } else if (tipo === "manual") {
        ranking.manual.push({ jugador: nombre, tiempo, cantidad_aciertos, cantidad_errores });
      }
    });

    ranking.secuencial.sort((a, b) => a.tiempo - b.tiempo);
    ranking.aleatorio.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);
    ranking.manual.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);

    res.json({ success: true, data: ranking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener ranking general", error: error.message });
  }
};
