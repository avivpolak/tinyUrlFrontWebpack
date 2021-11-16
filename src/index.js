document.getElementById('submit').addEventListener('click', hendleSubmit)
document.getElementById('copy').addEventListener('click', copyToClpiboard)
document.getElementById('clear').addEventListener('click', clearInput)
document.getElementById('register').addEventListener('click', register)
document.getElementById('login').addEventListener('click', login)
document.getElementById('logout').addEventListener('click', logOut)

const port = 3000
const baseUrl = `http://localhost:${port}`
if (localStorage.name) {
  loggedInAs(localStorage.name)
}
function loggedInAs(name) {
  document.getElementById('greetins').innerText = `welcome ${name}`
  document.getElementById('loginSection').classList.toggle('hide')
  document.getElementById('registerSection').classList.toggle('hide')
  document.getElementById('footer').classList.toggle('hide')
  document.getElementById('logout').classList.toggle('hide')
  document.getElementById('forMembers').classList.toggle('hide')
  showStatistics(localStorage.name, localStorage.password)
}
function logOut() {
  localStorage.clear()
  location.reload()
}
function hendleSubmit() {
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
    .put(`${baseUrl}/login`, 'data', {
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
    .put(`${baseUrl}/user/${username}`, 'data', {
      headers: headers,
    })
    .then(function (response) {
      document.getElementById('myArea').append(dataToTable(response.data))
    })
}

function postUrl(url) {
  let body = {
    url: document.getElementById('url').value,
    name: localStorage.name,
  }
  let api = `${baseUrl}/url/new`
  if (document.getElementById('spesiphic').value) {
    body.custom = document.getElementById('spesiphic').value
    api = `${baseUrl}/url/new/custom`
  }

  axios
    .post(api, body)
    .then(function (response) {
      document.getElementById('url').value = `${baseUrl}/url/${response.data}`
    })
    .catch(function (error) {
      if (error.response) {
        document.getElementById('error').innerText = error.response.data
      }
    })
}
function register() {
  document.getElementById('registerStatus').innerText = ''
  const headers = {
    username: document.getElementById('userName').value,
    password: document.getElementById('userPassword').value,
  }
  axios
    .post(`${baseUrl}/users/new`, 'data', {
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
