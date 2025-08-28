// models/Prueba.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Prueba = sequelize.define(
  "pruebas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    cuentaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cuentas", // referencia a la tabla cuentas
        key: "id",
      },
    },

    tipo: {
      type: DataTypes.ENUM("manual", "secuencial", "aleatorio"),
      allowNull: false,
    },

    // datos comunes
    cantidad_intentos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    cantidad_aciertos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    cantidad_errores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    // tiempos (manual y secuencial)
    tiempo_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tiempo_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // estado de la prueba
    estado: {
      type: DataTypes.ENUM("pendiente", "en_curso", "finalizada"),
      allowNull: false,
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "pruebas", // nombre de la tabla
    timestamps: false, // sin createdAt/updatedAt automáticos
  }
);
