// // Test import of a JavaScript module
// import { example } from '@/js/example'

// // Test import of an asset
// import webpackLogo from '@/images/webpack-logo.svg'

// // Test import of styles
// import '@/styles/index.scss'

// // Appending to the DOM
// const logo = document.createElement('img')
// logo.src = webpackLogo

// const heading = document.createElement('h1')
// heading.textContent = example()

// // Test a background image url in CSS
// const imageBackground = document.createElement('div')
// imageBackground.classList.add('image')

// // Test a public folder asset
// const imagePublic = document.createElement('img')
// imagePublic.src = '/assets/example.png'

// const app = document.querySelector('#root')
// app.append(logo, heading, imageBackground, imagePublic)

document.getElementById('submit').addEventListener('click', hendleSubmit)
document.getElementById('copy').addEventListener('click', copyToClpiboard)
document.getElementById('clear').addEventListener('click', clearInput)
document.getElementById('register').addEventListener('click', register)
document.getElementById('login').addEventListener('click', login)
document.getElementById('logout').addEventListener('click', logOut)

const PORT = 1042
if (localStorage.name) {
  loggedInAs(localStorage.name)
}
function loggedInAs(name) {
  document.getElementById('greetins').innerText = `welcome ${name}`
  document.getElementById('loginSection').classList.toggle('hide')
  document.getElementById('registerSection').classList.toggle('hide')
  document.getElementById('footer').classList.toggle('hide')
  document.getElementById('logout').classList.toggle('hide')
  showStatistics(localStorage.name, localStorage.password)
}
function logOut() {
  localStorage.clear()
  location.reload()
}
async function hendleSubmit() {
  document.getElementById('error').innerText = ''

  let url = document.getElementById('url').value
  if (!validate(url)) return
  postUrl(url)
}
function login() {
  document.getElementById('loginStatus').innerText = ''
  const headers = {
    username: document.getElementById('name').value,
    password: document.getElementById('password').value,
  }

  axios
    .put(`http://localhost:${PORT}/login`, 'data', {
      headers: headers,
    })
    .then(function (response) {
      localStorage.name = response.data.name
      localStorage.password = response.data.password
      showStatistics(response.data.name, document.getElementById('password').value)
      loggedInAs(localStorage.name)
    })
    .catch(function (error) {
      if (error.response) {
        document.getElementById('loginStatus').innerText = error.response.data
      }
    })
}

function validate(url) {
  return true //make it the same as the back
}
function showStatistics(username, password) {
  document.getElementById('myArea').innerHTML = ''
  const headers = {
    username: username,
    password: password,
  }
  axios
    .put(`http://localhost:${PORT}/users/${username}`, 'data', {
      headers: headers,
    })
    .then(function (response) {
      document.getElementById('myArea').append(dataToTable(response.data))
    })
}

async function postUrl(url) {
  const headers = {
    url: document.getElementById('url').value,
    name: localStorage.name,
  }
  axios
    .post(`http://localhost:${PORT}/new`, 'data', {
      //the data is not in use for now . nmake it work via data and not with header
      headers: headers,
    })
    .then(function (response) {
      document.getElementById('url').value = response.data
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        document.getElementById('error').innerText = error.response.data
      }
    })
}
async function register() {
  document.getElementById('registerStatus').innerText = ''
  const headers = {
    username: document.getElementById('userName').value,
    password: document.getElementById('userPassword').value,
  }
  axios
    .post(`http://localhost:${PORT}/users/new`, 'data', {
      headers: headers,
    })
    .then(function (response) {
      let greeting = `welome ${response.data.userName}, your password is  "${response.data.password}"`
      document.getElementById('registerStatus').innerText = greeting
    })
    .catch(function (error) {
      if (error.response) {
        document.getElementById('registerStatus').innerText = error.response.data
      }
    })
}

function copyToClpiboard() {
  const text = document.getElementById('url').value
  navigator.clipboard.writeText(text).then(
    function () {
      console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}

function clearInput() {
  document.getElementById('url').value = ''
}
function dataToTable(data) {
  let table = createElement('table')
  let shoutenedElem = createElement('td', ['shoutened url'])
  let longElem = createElement('td', ['long url'])
  let timesVisetedElem = createElement('td', ['Times Visited'])
  let header = createElement('thead', [shoutenedElem, longElem, timesVisetedElem])
  table.append(header)
  for (let colomn of data) {
    let tr = createElement('tr')
    for (let row of colomn) {
      let td = createElement('td', [row])
      tr.append(td)
    }
    table.append(tr)
  }
  return table
}
function createElement(tagname, children = [], classes = [], attributes, events) {
  //the most generic element builder.
  //we will build all the elements here.

  const el = document.createElement(tagname)

  //children

  for (let child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      child = document.createTextNode(child)
    }
    el.appendChild(child)
  }

  //classes

  for (const cls of classes) {
    el.classList.add(cls)
  }

  //attrubutes

  for (const attr in attributes) {
    el.setAttribute(attr, attributes[attr])
  }

  //attrubutes

  for (const event in events) {
    el.addEventListener(event, events[event])
  }

  return el
}
