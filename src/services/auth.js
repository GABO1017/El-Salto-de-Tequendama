import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase.config"; // Importa la configuración de Firebase, incluyendo la autenticación y Firestore
import Swal from "sweetalert2";
import "../styles/global.css";

// Creación del store de autenticación utilizando Zustand
const useAuthStore = create((set) => ({
  // Estado inicial
  user: null, // Estado para almacenar al usuario autenticado
  error: null, // Estado para almacenar cualquier error que ocurra

  // Función para registrar un nuevo usuario
  registerUser: async (email, password, username, navigate) => {
    try {
      // Verificar si el username ya está en uso en Firestore
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si el nombre de usuario ya está en uso
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error",
          text: "El nombre de usuario ya está registrado. Elige otro.",
          confirmButtonText: "Entendido",
          customClass: {
            confirmButton: "custom-swal-button", // Clase personalizada
          },
        });
        return;
      }

      // Intenta registrar al usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Obtenemos el usuario registrado desde Firebase

      // Guardar el nombre de usuario y el email en Firestore bajo el ID del usuario
      await setDoc(doc(db, "users", user.uid), {
        username: username, // Almacena el nombre de usuario
        email: email, // Almacena el email
      });

      // Actualiza el estado global con el usuario registrado y limpia los errores
      set({ user: { ...user, username }, error: null }); // Aquí añadimos el username al objeto user
      // Muestra el mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "¡Bienvenido! Tu aventura muisca esta a punto de comenzar.",
        confirmButtonText: "Vamos a ello!",
        customClass: {
          confirmButton: "custom-swal-button", // Clase personalizada
        },
      });

      // Navega a la página de login tras el registro exitoso
      navigate("/");
    } catch (error) {
      // Si ocurre un error, lo almacenamos en el estado y lo pasamos a validar
      let message = "Ha ocurrido un error";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "El correo electrónico ya está en uso";
          break;
        case "auth/weak-password":
          message =
            "La contraseña es muy débil. Debe tener al menos 8 caracteres";
          break;
        case "auth/invalid-email":
          message = "El formato del correo electrónico es inválido";
          break;
        case "auth/operation-not-allowed":
          message = "El registro de usuarios está deshabilitado temporalmente";
          break;
        default:
          message = error.message;
      }

      set({ error: message });

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: message,
        confirmButtonText: "Entendido",
        customClass: {
          confirmButton: "custom-swal-button", // Clase personalizada
        },
      });
    }
  },

  // Función para iniciar sesión con el nombre de usuario
  loginUser: async (username, password, navigate) => {
    try {
      // Referencia a la colección de usuarios en Firestore
      const usersRef = collection(db, "users");

      // Consulta a Firestore para encontrar el usuario con el nombre de usuario proporcionado
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      // Si no se encuentra ningún usuario con el nombre proporcionado
      if (querySnapshot.empty) {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "No se encontró un usuario con ese nombre.",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "custom-swal-button", // Clase personalizada
          },
        });
        return;
      }

      // Obtener el email del usuario encontrado
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;
      const userUsername = userDoc.data().username;

      // Iniciar sesión con el email y contraseña del usuario encontrado
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const user = userCredential.user;

      // Guardar el usuario autenticado y su username en el estado global
      set({ user: { ...user, username: userUsername }, error: null });

      // Mensaje de éxito de inicio de sesión
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Choc mhuquy (Bienvenido en muisca), " + username + "!",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "custom-swal-button", // Clase personalizada
        },
      });

      // Navegar al menú principal tras el inicio de sesión exitoso
      navigate("/menu");
    } catch (error) {
      let message = "Ha ocurrido un error";
      switch (error.code) {
        case "auth/user-not-found":
          message = "No se encontró un usuario con ese correo electrónico.";
          break;
        case "auth/invalid-credential":
          message = "Contraseña incorrecta.";
          break;
        case "auth/too-many-requests":
          message = "Demasiados intentos. Intenta de nuevo más tarde.";
          break;
        case "auth/invalid-email":
          message = "El correo electrónico es inválido.";
          break;
        default:
          message = error.message;
      }

      set({ error: message });

      // Mostrar mensaje de error con Swal
      Swal.fire({
        icon: "error",
        title: "Error en el inicio de sesión",
        text: message,
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "custom-swal-button", // Clase personalizada
        },
      });
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
      navigate("/registro");
    } catch (error) {
      // Si ocurre un error, lo almacenamos en el estado y lo mostramos en consola
      set({ error: error.message });
      console.error("Error al cerrar sesión:", error.message);
    }
  },
}));

// Exporta el store para ser utilizado en otros componentes de la aplicación
export default useAuthStore;
