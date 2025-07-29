import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const Jugador = sequelize.define(
  "jugadores",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    posicion_principal: {
      type: DataTypes.ENUM("armador", "opuesto", "central", "receptor", "libero"),
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 16,
        max: 35,
      },
    },
    altura: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 1.5,
        max: 2.2,
      },
    },
    anos_experiencia_voley: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 20,
      },
    },
    correo_institucional: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    numero_celular: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        len: [8, 15],
        isNumeric: true,
      },
    },
    cuentaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cuentas",
        key: "id",
      },
    },
  },
  {
    tableName: "jugadores",
    timestamps: false,
  },
)
