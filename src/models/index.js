import { Cuenta } from "./Cuenta.js"
import { Jugador } from "./Jugador.js"
import { Entrenador } from "./Entrenador.js"
import { Tecnico } from "./Tecnico.js"

// Definir asociaciones
Cuenta.hasOne(Jugador, { foreignKey: "cuentaId", as: "jugador" })
Cuenta.hasOne(Entrenador, { foreignKey: "cuentaId", as: "entrenador" })
Cuenta.hasOne(Tecnico, { foreignKey: "cuentaId", as: "tecnico" })

Jugador.belongsTo(Cuenta, { foreignKey: "cuentaId", as: "cuenta" })
Entrenador.belongsTo(Cuenta, { foreignKey: "cuentaId", as: "cuenta" })
Tecnico.belongsTo(Cuenta, { foreignKey: "cuentaId", as: "cuenta" })

export { Cuenta, Jugador, Entrenador, Tecnico }
