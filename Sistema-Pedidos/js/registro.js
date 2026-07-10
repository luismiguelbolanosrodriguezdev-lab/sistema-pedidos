import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

async function registrar_usuario() {

    try {

        const correo = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        const usuario = await createUserWithEmailAndPassword(
            auth,
            correo,
            password
        );

        console.log("Usuario creado:", usuario.user);

    } catch (error) {

        console.error(error);

    }

}

window.registrar_usuario = registrar_usuario;