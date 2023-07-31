let aboutUsModalBtn = document.querySelector('#aboutUs-modal')
let wrapper = document.querySelector('.wrapper');
let loginLink = document.querySelector('.login-link');
let registerLink = document.querySelector('.register-link');
let btnPopUp = document.querySelector('.btnLogin-popup');
let iconClose = document.querySelector('.icon-close');

let registerBtn = document.querySelector('.register-btn');
let loginBtn = document.querySelector('.login-btn');

let showUsername = document.querySelector('#showUsername')



let registerEmailInp = document.querySelector('.register-email-inp');
let registerPasswordInp = document.querySelector('.register-password-inp');
let registerUserNameInp = document.querySelector('.userName-inp');

let emailInp = document.querySelector('.email-inp');
let passwordInp = document.querySelector('.password-inp');

let imgInp = document.querySelector('#product-url-inp');
let titleInp = document.querySelector('#product-title-inp');
let salaryInp = document.querySelector('#product-salary-inp');
let addProductBtn = document.querySelector('.add-job-btn');
let saveProductBtn = document.querySelector('.save-job-btn');
let createJob = document.querySelector('#create');
let list = document.querySelector('.navigation');
console.log(addProductBtn,saveProductBtn);



const USERS_API = 'http://localhost:8000/users';



loginBtn.addEventListener('click', loginUser)


aboutUsModalBtn.addEventListener('click',showAboutUs);
registerLink.addEventListener('click', ()=>{
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=>{
    wrapper.classList.remove('active');
});

function showAboutUs(){
    let about = document.getElementsById('aboutUs-modal');
}
// console.log(loginLink,registerLink)

btnPopUp.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
})

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
})

async function checkUniqueEmail(email) {
    let res = await fetch(USERS_API);
    let users = await res.json();
    return users.some(user => user.email === email);
};

// REGISTER
async function registerUser(){
    let uniqueEmail = await checkUniqueEmail(registerEmailInp.value);

    if(uniqueEmail) {
        alert('User with this Email already exists!');
        return;
};
let userObj = {
    username: registerUserNameInp.value,
    email: registerEmailInp.value,
    password: registerPasswordInp.value,
};
console.log(userObj);

fetch(USERS_API, {
    method: 'POST',
    body: JSON.stringify(userObj),
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

    registerUserNameInp.value = ''
    registerEmailInp.value = ''
    registerPasswordInp.value = '';;

}
registerBtn.addEventListener('click',registerUser);

function checkUserInUsers(email,users){
    return users.some(item => item.email == email);
}
function checkUserPassword(user, password) {
    return user.password === password;
};



function setUserToStorage(username) {
    localStorage.setItem('user', JSON.stringify({username}));
};

async function checkLoginLogoutStatus() {
    let user = localStorage.getItem('user');
    if(!user) {
        showUsername.innerText = 'No user';
        return;
    } else {
        showUsername.innerText = await JSON.parse(user).username;
        return;
    };
};


// LOGINUSER
async function loginUser() {
    let res = await fetch(USERS_API);
    let users = await res.json();

    if(!checkUserInUsers(emailInp.value,users)){
        alert('Email in users not found');
        return;
    }

    let userObj = users.find(user => user.email === emailInp.value);

    if(!checkUserPassword(userObj, passwordInp.value)) {
        alert('Wrong password!');
        return;
    };

    setUserToStorage(userObj.email);

    emailInp.value = '';
    passwordInp.value = '';

    if(!checkLoginLogoutStatus()){
        alert('User is not online')
        return;
    }
    else{//(emailInp.value === 'Abdyldaev@gmail.com')//{
        list.innerHTML += `<a href="#" id="create" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Create Job</a>`;
    }
}

function clearJobForm() {
    imgInp.value = "",
    salaryInp.value = "",
    titleInp.value = ""
}

// CREATE JOBS
const JOBS_API = 'http://localhost:8000/jobs';
async function createJobs() {
    if(
        !imgInp.value.trim() ||
        !salaryInp.value.trim() ||
        !titleInp.value.trim()
    ) return alert('Some inputs are empty!');

    let jobObj = {
        url: imgInp.value,
        title: titleInp.value,
        salary: salaryInp.value
    };

    await fetch(JOBS_API, {
        method: 'POST',
        body: JSON.stringify(jobObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    clearJobForm();
}

addProductBtn.addEventListener('click',createJobs);

// READ
async function read(){
let requestAPI = `${JOBS_API}`

let container = document.querySelector('.container');

container.innerHTML = '';

let res = await fetch(requestAPI);

let products = await res.json();
products.forEach(product => {
    container.innerHTML += `
    <div class="card m-5" style="width: 18rem;">
        <img src="${product.url}" class="card-img-top" alt="error:(" height="200">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.salary}$</p>
        </div>
    </div>
    `;
});
}
read();


// // delete
async function deleteProduct(e) {
    let productId = e.target.id.split('-')[1];

    await fetch(`${PRODUCTS_API}/${productId}`, {
        method: 'DELETE'
    });

    render();
};

function addDeleteEvent() {
    let deleteProductBtns = document.querySelectorAll('.btn-delete');
    deleteProductBtns.forEach(btn => btn.addEventListener('click', deleteProduct));
};
