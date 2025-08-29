import { Op } from "sequelize";
import { Prueba } from "../models/Prueba.js";
import { Cuenta } from "../models/Cuenta.js";

// Ranking personal
export const rankingPersonal = async (req, res) => {
  try {
    const { cuentaId } = req.params;
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 7); // Últimos 7 días

    const pruebas = await Prueba.findAll({
      where: {
        cuentaId,
        estado: "finalizada",
        tiempo_fin: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: [{ model: Cuenta, attributes: ["nombre"] }],
    });

    const ranking = {
      secuencial: [],
      aleatorio: [],
      manual: [],
    };

    // Procesar pruebas para ranking personal
    pruebas.forEach((prueba) => {
      const { tipo, tiempo_fin, cantidad_aciertos, cantidad_errores } = prueba;
      const tiempo = tiempo_fin - prueba.tiempo_inicio; // Calcular tiempo en milisegundos

      if (tipo === "secuencial") {
        ranking.secuencial.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad: 1, // Contar repeticiones
        });
      } else if (tipo === "aleatorio") {
        ranking.aleatorio.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad_aciertos,
          cantidad_errores,
        });
      } else if (tipo === "manual") {
        ranking.manual.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad_aciertos,
          cantidad_errores,
        });
      }
    });

    // Ordenar rankings
    ranking.secuencial.sort((a, b) => a.tiempo - b.tiempo);
    ranking.aleatorio.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);
    ranking.manual.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);

    res.json({ success: true, data: ranking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener ranking personal", error: error.message });
  }
};

// Ranking general
export const rankingGeneral = async (req, res) => {
  try {
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - 7); // Últimos 7 días

    const pruebas = await Prueba.findAll({
      where: {
        estado: "finalizada",
        tiempo_fin: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: [{ model: Cuenta, attributes: ["nombre"] }],
    });

    const ranking = {
      secuencial: [],
      aleatorio: [],
      manual: [],
    };

    // Procesar pruebas para ranking general
    pruebas.forEach((prueba) => {
      const { tipo, tiempo_fin, cantidad_aciertos, cantidad_errores } = prueba;
      const tiempo = tiempo_fin - prueba.tiempo_inicio; // Calcular tiempo en milisegundos

      if (tipo === "secuencial") {
        ranking.secuencial.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad: 1, // Contar repeticiones
        });
      } else if (tipo === "aleatorio") {
        ranking.aleatorio.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad_aciertos,
          cantidad_errores,
        });
      } else if (tipo === "manual") {
        ranking.manual.push({
          jugador: prueba.Cuenta.nombre,
          tiempo,
          cantidad_aciertos,
          cantidad_errores,
        });
      }
    });

    // Ordenar rankings
    ranking.secuencial.sort((a, b) => a.tiempo - b.tiempo);
    ranking.aleatorio.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);
    ranking.manual.sort((a, b) => b.cantidad_aciertos - a.cantidad_aciertos);

    res.json({ success: true, data: ranking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener ranking general", error: error.message });
  }
};
