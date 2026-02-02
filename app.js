/* =====================================================
   1️⃣ VARIABLES GLOBALES
   Aquí obtenemos elementos del HTML y definimos URLs
===================================================== */

// Formulario donde el usuario inicia sesión
const formIn = document.getElementById("form-in");

// Formulario donde el usuario se registra
const formUp = document.getElementById("form-up");

// Botón que muestra el formulario de registro
const upS = document.getElementById("up");

// Botón que muestra el formulario de login
const inS = document.getElementById("in");

// Mensaje que muestra errores o éxito en el login
const msg = document.querySelector(".alert-acceso");

// Mensaje que muestra errores o éxito en el registro
const msgR = document.querySelector(".register");

// Dirección donde están guardados los usuarios normales
const urlUsers = "http://localhost:3000/usuarios";

// Dirección donde están guardados los administradores
const urlAdmin = "http://localhost:3000/admin";

/* =====================================================
   2️⃣ LOGIN DE USUARIOS Y ADMINISTRADORES
===================================================== */

const loginUsersAdmin = async () => {
  try {
    // Pedimos la lista de usuarios al servidor
    const respUser = await fetch(urlUsers);

    // Pedimos la lista de administradores al servidor
    const respAdmin = await fetch(urlAdmin);

    // Si alguna petición falla, lanzamos un error
    if (!respUser.ok || !respAdmin.ok) {
      throw new Error("No se pudieron cargar los datos");
    }

    // Convertimos las respuestas a formato JSON
    const dataUser = await respUser.json();
    const dataAdmin = await respAdmin.json();

    // Unimos usuarios y administradores en un solo arreglo
    const allData = [...dataUser, ...dataAdmin];

    /* =================================================
       3️⃣ MOSTRAR Y OCULTAR FORMULARIOS
    ================================================= */

    // Función para mostrar el formulario de LOGIN
    window.singIn = function () {
      // Oculta el formulario de registro
      formUp.classList.add("d-none");

      // Muestra el formulario de login
      formIn.classList.remove("d-none");

      // Limpia los campos del login
      formIn.user.value = "";
      formIn.password.value = "";
      formIn.rol.value = "user";

      // Limpia el mensaje de error o éxito
      msg.innerHTML = "";
    };

    // Función para mostrar el formulario de REGISTRO
    window.singUp = function () {
      // Oculta el formulario de login
      formIn.classList.add("d-none");

      // Muestra el formulario de registro
      formUp.classList.remove("d-none");

      // Limpia todos los inputs del formulario de registro
      formUp.querySelectorAll("input").forEach(input => {
        input.value = "";
      });

      // Limpia el mensaje del registro
      msgR.innerHTML = "";
    };

    // Cuando el usuario hace clic en "Registrarse"
    upS.addEventListener("click", e => {
      e.preventDefault(); // Evita que el enlace recargue la página
      singUp(); // Muestra el formulario de registro
    });

    // Cuando el usuario hace clic en "Iniciar sesión"
    inS.addEventListener("click", e => {
      e.preventDefault(); // Evita que el enlace recargue la página
      singIn(); // Muestra el formulario de login
    });

    /* =================================================
       4️⃣ PROCESO DE LOGIN
    ================================================= */

    formIn.addEventListener("submit", e => {
      e.preventDefault(); // Evita recargar la página

      // Guardamos los valores que escribió el usuario
      const userValue = formIn.user.value.trim();
      const passwordValue = formIn.password.value.trim();
      const rolValue = formIn.rol.value.trim();

      // Verificamos que ningún campo esté vacío
      if (!userValue || !passwordValue || !rolValue) {
        msg.innerHTML =
          `<span class="text-warning">Todos los campos son obligatorios</span>`;
        return;
      }

      // Buscamos si existe un usuario con esos datos
      const acceso = allData.find(persona =>
        persona.user === userValue &&
        persona.password == passwordValue &&
        persona.rol === rolValue
      );

      // Si no se encuentra el usuario
      if (!acceso) {
        msg.innerHTML =
          `<span class="text-danger">Datos incorrectos</span>`;
        return;
      }

      /* =============================================
         5️⃣ LOGIN EXITOSO
      ============================================= */

      // Guardamos datos en sessionStorage
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("rol", acceso.rol);
      sessionStorage.setItem("userId", acceso.id);

      // Mensaje de éxito
      msg.innerHTML =
        `<span class="text-success">Acceso correcto, redirigiendo...</span>`;

      // Redirige según el rol del usuario
      setTimeout(() => {
        if (acceso.rol === "admin") {
          window.location.href = "./admin/dashboard.html";
        } else {
          window.location.href = "./user/home.html";
        }
      }, 1000);
    });
  } catch (error) {
    // Muestra errores en consola si algo falla
    console.error("Error:", error);
  }
};

/* =====================================================
   6️⃣ REGISTRO DE NUEVOS USUARIOS
===================================================== */

const loginRegisterUser = async () => {
  let allUsers = [];

  try {
    // Obtenemos los usuarios ya registrados
    const resp = await fetch(urlUsers);

    if (!resp.ok) throw new Error("Error al cargar usuarios");

    allUsers = await resp.json();
  } catch (error) {
    console.error(error);
  }

  // Evento cuando se envía el formulario de registro
  formUp.addEventListener("submit", async e => {
    e.preventDefault(); // Evita recargar la página

    // Creamos el nuevo usuario
    const newUser = {
      avatar: "https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg",
      name: formUp.name.value.trim(),
      email: formUp.email.value.trim(),
      user: formUp.user.value.trim(),
      password: formUp.password.value.trim(),
      rol: "user"
    };

    // Verificamos que ningún campo esté vacío
    for (let campo in newUser) {
      if (!newUser[campo]) {
        msgR.innerHTML =
          `<span class="text-warning">El campo ${campo} es obligatorio</span>`;
        return;
      }
    }

    // Verificamos si el usuario o correo ya existen
    const exists = allUsers.find(
      u => u.user === newUser.user || u.email === newUser.email
    );

    if (exists) {
      msgR.innerHTML =
        `<span class="text-danger">Usuario o correo ya registrado</span>`;
      return;
    }

    try {
      // Enviamos el nuevo usuario al servidor
      const register = await fetch(urlUsers, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!register.ok) throw new Error("Error al registrar");

      // Mensaje de éxito
      msgR.innerHTML =
        `<span class="text-success">Registro exitoso</span>`;

      // Redirige al login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      msgR.innerHTML =
        `<span class="text-danger">Error al registrar</span>`;
    }
  });
};

/* =====================================================
   7️⃣ INICIO DE LA APLICACIÓN
===================================================== */

// Activa la funcionalidad de registro
loginRegisterUser();

// Activa la funcionalidad de login
loginUsersAdmin();
