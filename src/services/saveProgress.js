import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

/**
 * Guarda el progreso del jugador en Firestore.
 * @param {string} userId - ID del usuario autenticado.
 * @param {object} progressData - Datos de progreso (posición, salud, etc.).
 * @param {function} onAlert - Función para mostrar alertas.
 */
export const saveGameProgress = async (userId, progressData, onAlert) => {
  try {
    const selectedCharacter =
      localStorage.getItem("selectedCharacter") || "Sue"; // Valor por defecto

    await setDoc(
      doc(db, "userProgress", userId),
      { ...progressData, character: selectedCharacter }, // Agregar personaje
      { merge: true }
    );

    console.log("Progreso guardado:", {
      ...progressData,
      character: selectedCharacter,
    });
    onAlert("Progreso guardado exitosamente", "success");
  } catch (error) {
    console.error("Error al guardar el progreso:", error);
    onAlert("Error al guardar el progreso", "error");
  }
};

/**
 * Carga el progreso guardado del jugador desde Firestore.
 * @param {string} userId - ID del usuario.
 * @returns {object|null} - Datos de progreso o null si no hay progreso guardado.
 */
export const loadGameProgress = async (userId) => {
  try {
    const docRef = doc(db, "userProgress", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const progressData = docSnap.data();
      console.log("Progreso cargado:", progressData);

      // Guardar el personaje en localStorage
      if (progressData.character) {
        localStorage.setItem("selectedCharacter", progressData.character);
      }

      return progressData;
    }
    return null;
  } catch (error) {
    console.error("Error al cargar el progreso:", error);
    return null;
  }
};

/**
 * Reinicia el progreso del jugador a valores predeterminados.
 * @param {string} userId - ID del usuario.
 * @param {function} onAlert - Función para mostrar alertas.
 */
export const resetGameProgress = async (userId, onAlert) => {
  try {
    const defaultProgress = {
      position: { x: -10, y: 0.5, z: 0 },
      health: 100,
    };

    await setDoc(doc(db, "userProgress", userId), defaultProgress);

    console.log("Progreso reiniciado:", defaultProgress);
    onAlert("Progreso reiniciado correctamente", "info");
  } catch (error) {
    console.error("Error al reiniciar el progreso:", error);
    onAlert("Error al reiniciar el progreso", "error");
  }
};
