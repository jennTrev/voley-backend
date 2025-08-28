import { sequelize } from "../config/database.js";
import { Prueba } from "../models/Prueba.js";

// IDs de cuentas de tu base de datos
const cuentas = [10, 3, 4, 9]; // cuentaId de las cuentas

const seedPruebas = async () => {
  try {
    await sequelize.sync({ force: false }); // solo crea la tabla si no existe

    const pruebasData = [];

    // Generar pruebas secuenciales
    cuentas.forEach((cuentaId) => {
      const aciertos = Math.floor(Math.random() * 10) + 5; // 5 a 14 aciertos
      const errores = Math.floor(Math.random() * 5); // 0 a 4 errores
      pruebasData.push({
        tipo: "secuencial",
        cuentaId,
        tiempo_inicio: new Date(Date.now() - 60000), // 1 min antes
        tiempo_fin: new Date(),
        cantidad_aciertos: aciertos,
        cantidad_errores: errores,
        cantidad_intentos: aciertos + errores,
        estado: "finalizada", // Establecer estado como "finalizada"
      });
    });

    // Generar pruebas aleatorias
    cuentas.forEach((cuentaId) => {
      const aciertos = Math.floor(Math.random() * 15) + 5; // 5 a 19
      const errores = Math.floor(Math.random() * 5); // 0 a 4
      pruebasData.push({
        tipo: "aleatorio",
        cuentaId,
        tiempo_inicio: new Date(Date.now() - 180000), // 3 minutos antes
        tiempo_fin: new Date(),
        cantidad_aciertos: aciertos,
        cantidad_errores: errores,
        cantidad_intentos: aciertos + errores,
        estado: "finalizada", // Establecer estado como "finalizada"
      });
    });

    // Generar pruebas manuales
    cuentas.forEach((cuentaId) => {
      const aciertos = Math.floor(Math.random() * 10) + 5;
      const errores = Math.floor(Math.random() * 5);
      pruebasData.push({
        tipo: "manual",
        cuentaId,
        tiempo_inicio: new Date(Date.now() - 600000), // 10 min antes
        tiempo_fin: new Date(),
        cantidad_aciertos: aciertos,
        cantidad_errores: errores,
        cantidad_intentos: aciertos + errores,
        estado: "finalizada", // Establecer estado como "finalizada"
      });
    });

    // Insertar en la base de datos
    await Prueba.bulkCreate(pruebasData);
    console.log("Pruebas simuladas creadas exitosamente");
    process.exit();
  } catch (error) {
    console.error("Error al crear pruebas simuladas:", error);
    process.exit(1);
  }
};

seedPruebas();
