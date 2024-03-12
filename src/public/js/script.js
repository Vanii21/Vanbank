// Funcion del login
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Validar datos en los inputs
function f_blur(){
    if (document.getElementById('pass').value.length > 8){
        swal('La contraseña debe ser menor o igual a 8');
    }
}