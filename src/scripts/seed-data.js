import { connectDB } from "../config/database.js"
import { Cuenta, Jugador, Entrenador, Tecnico } from "../models/index.js"

async function seedData() {
  try {
    await connectDB()

    // Crear técnico admin
    const cuentaTecnico = await Cuenta.create({
      usuario: "admin",
      contraseña: "admin123",
      rol: "tecnico",
    })

    await Tecnico.create({
      nombres: "Carlos",
      apellidos: "Rodríguez",
      edad: 45,
      correo_institucional: "admin@universidad.edu",
      numero_celular: "987654321",
      cuentaId: cuentaTecnico.id,
    })

    // Crear entrenador
    const cuentaEntrenador = await Cuenta.create({
      usuario: "coach01",
      contraseña: "coach123",
      rol: "entrenador",
    })

    await Entrenador.create({
      nombres: "María",
      apellidos: "González",
      edad: 35,
      anos_experiencia_voley: 10,
      numero_celular: "987654322",
      correo_electronico: "coach@universidad.edu",
      cuentaId: cuentaEntrenador.id,
    })

    // Crear jugador
    const cuentaJugador = await Cuenta.create({
      usuario: "player01",
      contraseña: "player123",
      rol: "jugador",
    })

    await Jugador.create({
      nombres: "Ana",
      apellidos: "Martínez",
      carrera: "Ingeniería de Sistemas",
      posicion_principal: "armador",
      edad: 20,
      altura: 1.75,
      anos_experiencia_voley: 5,
      correo_institucional: "ana.martinez@estudiante.edu",
      numero_celular: "987654323",
      cuentaId: cuentaJugador.id,
    })

    console.log("✅ Datos de prueba creados exitosamente")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error al crear datos de prueba:", error)
    process.exit(1)
  }
}

seedData()
