/* =========================
   VARIABLES GLOBALES
========================= */
const formIn = document.getElementById("form-in");
const formUp = document.getElementById("form-up");
const upS = document.getElementById("up");
const inS = document.getElementById("in");
const msg = document.querySelector(".alert-acceso");
const msgR = document.querySelector(".register");

const urlUsers = "http://localhost:3000/usuarios";
const urlAdmin = "http://localhost:3000/admin";

/* =========================
   LOGIN USER + ADMIN
========================= */
const loginUsersAdmin = async () => {
  try {
    const respUser = await fetch(urlUsers);
    const respAdmin = await fetch(urlAdmin);

    if (!respUser.ok || !respAdmin.ok) {
      throw new Error("Error cargando usuarios");
    }

    const dataUser = await respUser.json();
    const dataAdmin = await respAdmin.json();

    const allData = [...dataUser, ...dataAdmin];

    /* =========================
       MOSTRAR / OCULTAR FORMS
    ========================= */
    window.singIn = function () {
      formUp.classList.add("d-none");
      formIn.classList.remove("d-none");

      formIn.user.value = "";
      formIn.password.value = "";
      formIn.rol.value = "user";
      msg.innerHTML = "";
    };

    window.singUp = function () {
      formIn.classList.add("d-none");
      formUp.classList.remove("d-none");

      formUp.querySelectorAll("input").forEach(i => (i.value = ""));
      msgR.innerHTML = "";
    };

    upS.addEventListener("click", e => {
      e.preventDefault();
      singUp();
    });

    inS.addEventListener("click", e => {
      e.preventDefault();
      singIn();
    });

    /* =========================
       EVENTO LOGIN
    ========================= */
    formIn.addEventListener("submit", e => {
      e.preventDefault();

      const userValue = formIn.user.value.trim();
      const passwordValue = formIn.password.value.trim();
      const rolValue = formIn.rol.value.trim();

      if (!userValue || !passwordValue || !rolValue) {
        msg.innerHTML =
          `<span class="text-warning">Todos los campos son obligatorios</span>`;
        return;
      }

      const acceso = allData.find(
        u =>
          u.user === userValue &&
          u.password == passwordValue &&
          u.rol === rolValue
      );

      if (!acceso) {
        msg.innerHTML =
          `<span class="text-danger">Usuario, contraseña o rol incorrecto</span>`;
        return;
      }

      /* =========================
         LOGIN CORRECTO
      ========================= */
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("rol", acceso.rol);
      sessionStorage.setItem("userId", acceso.id);

      msg.innerHTML =
        `<span class="text-success">Acceso correcto, redirigiendo...</span>`;

      setTimeout(() => {
        if (acceso.rol === "admin") {
          window.location.href = "./admin/dashboard.html";
        } else {
          window.location.href = "./user/home.html";
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

/* =========================
   REGISTRO DE USUARIOS
========================= */
const loginRegisterUser = async () => {
  let allUsers = [];

  try {
    const resp = await fetch(urlUsers);
    if (!resp.ok) throw new Error("Error cargando usuarios");
    allUsers = await resp.json();
  } catch (error) {
    console.error(error);
  }

  formUp.addEventListener("submit", async e => {
    e.preventDefault();

    const newUser = {
      avatar:
        "https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg",
      name: formUp.name.value.trim(),
      email: formUp.email.value.trim(),
      user: formUp.user.value.trim(),
      password: formUp.password.value.trim(),
      rol: "user"
    };

    for (let key in newUser) {
      if (!newUser[key]) {
        msgR.innerHTML =
          `<span class="text-warning">El campo ${key} es obligatorio</span>`;
        return;
      }
    }

    const exists = allUsers.find(
      u => u.user === newUser.user || u.email === newUser.email
    );

    if (exists) {
      msgR.innerHTML =
        `<span class="text-danger">Usuario o correo ya registrado</span>`;
      return;
    }

    try {
      const register = await fetch(urlUsers, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!register.ok) throw new Error("Error registrando usuario");

      msgR.innerHTML =
        `<span class="text-success">Registro exitoso</span>`;

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      msgR.innerHTML =
        `<span class="text-danger">Error al registrar</span>`;
    }
  });
};

/* =========================
   INIT
========================= */
loginRegisterUser();
loginUsersAdmin();
