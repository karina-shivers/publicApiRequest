let employees = [];
const urlAPI = `https://randomuser.me/api/?results=50&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gallery = document.querySelector('.gallery');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-info-container');
const modal = document.querySelector('.modal')
const modalClose = document.querySelector('.modal-close-btn');
const modalPrev = document.querySelector('.modal-prev')
const modalNext = document.querySelector('.modal-next')


fetch(urlAPI)
  .then(res => res.json())
  .then(res => res.results)
  .then(data => {
    employees = data
    addPagination(data)
    displayEmployees(data, 1)
  })
  .catch(err => console.log(err));

function displayEmployees (employeeData, page) {
  const endIndex = page * 12

  const gallery = document.querySelector('.gallery')
  gallery.innerHTML = ''
 
  let employeeHTML = '';

  for (let i = 0; i < employeeData.length; i++) {
    if (i >= startIndex && i < endIndex) {
      const name = employeeData[i].name;
      const email = employeeData[i].email;
      const city = employeeData[i].location.city;
      const picture = employeeData[i].picture;
      const state = employeeData[i].location.state
      // template literals make this so much cleaner!
      employeeHTML += `
    <div class="card" data-index="${i}">
    <div class="card-img-container">
            <img class="card-img" src="${picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${city}, ${state} </p>
        </div>
    </div>
    `
    }
  }
  gallery.innerHTML = employeeHTML;
}
function displayModal (index) {
  // use object destructuring make our template literal cleaner
  const { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
  const date = new Date(dob.date);

  const modalHTML = `
      <img class="modal-img" data-index='${index}' src="${picture.large}" alt="profile picture">
      <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
      <p class="modal-text">${email}</p>
      <p class="modal-text cap">${city}</p>
      <hr>
      <p class="modal-text">${phone}</p>
      <p class="modal-text">${street.name} ${street.number}, ${state} ${postcode}</p>
      <p class="modal-text">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    `

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = modalHTML;
}

modalClose.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

gallery.addEventListener('click', e => {

  const card = e.target.closest('.card');
  console.log(card)
  const index = card.getAttribute('data-index')
  displayModal(index);
})

modalPrev.addEventListener('click', e => {

  const img = document.querySelector('.modal-img').getAttribute('data-index')
  const index = parseInt(img) - 1
  if (index > 0) { 
    displayModal(index)
  } else {
    displayModal(employees.length - 1);
  }
})

modalNext.addEventListener('click', e => {

  const img = document.querySelector('.modal-img').getAttribute('data-index')
  const index = parseInt(img) + 1
  if (index < employees.length - 1) {
    displayModal(index)
  } else {
    displayModal(0);
  }
})

// Add Pagination //

function addPagination (list) {
 
  const numOfPages = Math.ceil(list.length / 12)

  
  let buttonHTML = ''

  for (let i = 1; i <= numOfPages; i++) {
    buttonHTML += `
     <li>
       <button type="button">${i}</button>
     </li>    
     `
    // console.log(buttonHTML);
  }
  const pagination = document.querySelector('.pagination')
  pagination.innerHTML = ''
  pagination.insertAdjacentHTML('beforeend', buttonHTML)

  const button = document.querySelectorAll("button[type='button']")
  button[0].className = 'active'
  // console.log(button);

  pagination.addEventListener('click', (e) => {
    const buttonClicked = e.target
    if (buttonClicked.tagName === 'BUTTON') {
      const activeClassButton = document.getElementsByClassName('active')
      activeClassButton[0].className = ''
      buttonClicked.className = 'active'
      displayEmployees(list, buttonClicked.textContent)
    }
  })
}


const searchInput = document.getElementById('search-input')
let newEmployeeList = []

searchInput.addEventListener('keyup', (e) => {
  const filterInput = e.target.value.toLowerCase()
  buttonHTML = ''

 
  const filteredStudent = employees.filter(employee => {
    return employee.name.first.toLowerCase().includes(filterInput) || employee.name.last.toLowerCase().includes(filterInput)
  })

  newEmployeeList = filteredStudent
  addPagination(newEmployeeList)
  displayEmployees(newEmployeeList, 1)
})
