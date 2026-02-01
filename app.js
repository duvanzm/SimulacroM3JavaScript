// Variables globales
const formIn = document.getElementById("form-in");
const formUp = document.getElementById("form-up");
const upS = document.getElementById("up");
const inS = document.getElementById("in");
const msg = document.querySelector(".alert-acceso");
const msgR = document.querySelector(".register")

const urlUsers = "http://localhost:3000/usuarios";   
const urlAdmin = "http://localhost:3000/admin";

const loginUsersAdmin = async () => {
  try {
    const respUser = await fetch(urlUsers);
    const respAdmin = await fetch(urlAdmin);

    if (!respUser.ok || !respAdmin.ok) {
      throw new Error(`Error HTTP: ${respUser.status} ${respAdmin.status}`);
    }

    const dataUser = await respUser.json();
    const dataAdmin = await respAdmin.json();
    const allData = [...dataUser, ...dataAdmin];

    console.log(allData);

    // Funciones para mostrar/ocultar formularios 
   
    window.singIn = function () {
      formUp.classList.add("d-none");
      formIn.classList.remove("d-none");
      formIn.classList.add("d-block");

      // Limpiar inputs y mensaje
      formIn.user.value = "";
      formIn.password.value = "";
      formIn.rol.value = "user";
      msg.innerHTML = "";
    }

    window.singUp = function () {
      formIn.classList.add("d-none");
      formUp.classList.remove("d-none");
      formUp.classList.add("d-block");

      // Limpiar inputs y mensaje
      formUp.querySelectorAll("input").forEach(input => input.value = "");
      msg.innerHTML = "";
    }

    //  Eventos para cambiar entre login y registro 
    upS.addEventListener("click", (e) => {
      e.preventDefault();
      singUp();
    });

    inS.addEventListener("click", (e) => {
      e.preventDefault();
      singIn();
    });

    //  Evento de login 
    formIn.addEventListener("submit", (event) => {
      event.preventDefault();

      const inpusUsers = new Map([
        ["user", formIn.user.value.trim()],
        ["password", formIn.password.value.trim()],
        ["rol", formIn.rol.value.trim()]
      ]);

      msg.innerHTML = "";

      // Validación campos vacíos
      for (let [key, value] of inpusUsers.entries()) {
        if (!value) {
          msg.innerHTML = `<span class="text-warning">El campo ${key} es obligatorio</span>`;
          return;
        }
      }

      // Validación de usuario
      const acceso = allData.find(
        (user) =>
          user.user === inpusUsers.get("user") &&
          user.password === inpusUsers.get("password") &&
          user.rol === inpusUsers.get("rol")
      );

      if (acceso) {
        sessionStorage.setItem("loginUser", "true");
        msg.innerHTML = `<span class="text-success">Acceso correcto, redirigiendo...</span>`;

        formIn.user.value = "";
        formIn.password.value = "";

        setTimeout(() => {
          window.location.href = "home.html"; // tu página de destino real
        }, 1000);
      } else {
        msg.innerHTML = `<span class="text-danger">Usuario, contraseña o rol incorrecto</span>`;
      }
    });

    //  Evento de login 

    return allData, dataUser, dataAdmin
  } catch (error) {
    console.error("Error de petición:", error);
  }
};


const loginRegisterUser = async function() {

  // Traer todos los usuarios antes de registrar
  let allData = [];
  try {
    const resp = await fetch(urlUsers);
    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    allData = await resp.json();
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }

  formUp.addEventListener("submit", async function(e){
    e.preventDefault();

    const newUser = {
      avatar: "https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg",
      name: formUp.name.value.trim(),
      email: formUp.email.value.trim(),
      user: formUp.user.value.trim(),
      password: formUp.password.value.trim(),
      rol: "user"
    };

    // Validación campos vacíos
    for (let key in newUser) {
      if (!newUser[key]) {
        msgR.innerHTML = `<span class="text-warning">El campo ${key} es obligatorio</span>`;
        return;
      }
    }

    //Validación: verificar si usuario o email ya existe
    const usuarioExistente = allData.find(u => u.user === newUser.user || u.email === newUser.email);
    if (usuarioExistente) {
      msgR.innerHTML = `<span class="text-danger">El usuario o correo ya está registrado</span>`;
      return;
    }

    try {
      const register = await fetch(urlUsers, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!register.ok) throw new Error(`HTTP error! status: ${register.status}`);

      const rep = await register.json();

      if (rep) {
        msgR.innerHTML = `<span class="text-success">Se registró exitosamente</span>`;
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      }

    } catch (error) {
      console.error("Error de petición:", error);
      msgR.innerHTML = `<span class="text-danger">Error al registrar: ${error.message}</span>`;
    }

  });

};


loginRegisterUser();
loginUsersAdmin();
export default loginUsersAdmin;
