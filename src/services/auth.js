import { create } from "zustand";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config"; // Importa la configuración de Firebase, incluyendo la autenticación y Firestore

// Creación del store de autenticación utilizando Zustand
const useAuthStore = create((set) => ({
  // Estado inicial
  user: null,  // Estado para almacenar al usuario autenticado
  error: null, // Estado para almacenar cualquier error que ocurra

  // Función para registrar un nuevo usuario
  registerUser: async (email, password, username, navigate) => {
    try {
      // Intenta registrar al usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obtenemos el usuario registrado desde Firebase

      // Guardar el nombre de usuario y el email en Firestore bajo el ID del usuario
      await setDoc(doc(db, "users", user.uid), {
        username: username,  // Almacena el nombre de usuario
        email: email         // Almacena el email
      });
      
      // Actualiza el estado global con el usuario registrado y limpia los errores
      set({ user: { ...user, username }, error: null }); // Aquí añadimos el username al objeto user
      console.log("Usuario registrado:", user);

      // Navega a la página de login tras el registro exitoso
      navigate('/'); 
    } catch (error) {
      // Si ocurre un error, lo almacenamos en el estado y lo mostramos en consola
      set({ error: error.message });
      console.error("Error al registrar usuario:", error.message);
    }
  },

  // Función para iniciar sesión con el nombre de usuario
  loginUser: async (username, password, navigate) => {
    try {
      // Referencia a la colección de usuarios en Firestore
      const usersRef = collection(db, "users");

      // Consulta a Firestore para encontrar el usuario con el nombre de usuario proporcionado
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q); // Realiza la consulta

      // Si no se encuentra ningún usuario con el nombre proporcionado, lanza un error
      if (querySnapshot.empty) {
        throw new Error("No se encontró un usuario con ese nombre.");
      }

      // Obtiene el primer documento (usuario) encontrado en la consulta
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email; // Extrae el email del usuario
      const userUsername = userDoc.data().username; // Obtener el username del documento

      // Inicia sesión con el email y contraseña del usuario encontrado
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user; // Obtenemos el usuario autenticado

      // Actualiza el estado global con el usuario autenticado, incluyendo el username
      set({ user: { ...user, username: userUsername }, error: null }); // Aquí añadimos el username al objeto user
      console.log("Usuario autenticado:", user);

      // Navega al menú principal tras el inicio de sesión exitoso
      navigate('/menu'); 
    } catch (error) {
      // Si ocurre un error, lo almacenamos en el estado y lo mostramos en consola
      set({ error: error.message });
      console.error("Error al iniciar sesión:", error.message);
    }
  },

  // Función para cerrar sesión
  logoutUser: async (navigate) => {
    try {
      // Cierra sesión en Firebase
      await signOut(auth);

      // Actualiza el estado global para borrar el usuario autenticado
      set({ user: null });
      console.log("Usuario ha cerrado sesión.");

      // Navega a la página de registro tras cerrar sesión
      navigate('/registro'); 
    } catch (error) {
      // Si ocurre un error, lo almacenamos en el estado y lo mostramos en consola
      set({ error: error.message });
      console.error("Error al cerrar sesión:", error.message);
    }
  }
}));

// Exporta el store para ser utilizado en otros componentes de la aplicación
export default useAuthStore;
