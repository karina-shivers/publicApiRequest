
// load the results from the API and display them
document.addEventListener('DOMContentLoaded', function() {
    fetch("https://randomuser.me/api/?results=12&nat=US")
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            renderGallery(data.results)
            renderSearchBox(data.results)
        });
})

// renders the search box
function renderSearchBox(users) {
    let searchContainer = document.querySelector('.search-container')
    searchContainer.insertAdjacentHTML('beforeend',
        `<form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>`
    )

    let searchForm = document.querySelector('form')
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault()
        let searchBox = document.querySelector('#search-input')
        let searchText = searchBox.value

        let searchResults = []
        for (let user of users) {
            let userName = `${user.name.first} ${user.name.last}`
            if (userName.toLowerCase().includes(searchText.toLowerCase())) {
                searchResults.push(user)
            }
        }

        renderGallery(searchResults)
    })
}

// renders the user cards
function renderGallery(users) {
    let gallery = document.querySelector('#gallery')
    //delete existing children so we always render the gallery from scratch
    gallery.replaceChildren()

    for (let i = 0; i < users.length; i++){
        let user = users[i]
        gallery.insertAdjacentHTML('beforeend',
            `<div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">
                        ${user.name.first} ${user.name.last}
                    </h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">
                        ${user.location.city}, ${user.location.state}
                    </p>
                </div>
            </div>`
        )
        //the card is the last item inserted to gallery so grab that
        let card = gallery.lastChild
        //this is to show a modal when you click on it
        card.addEventListener('click', function() {
            showModal(i, users)
        })
    }
}

//for the modal
function showModal(i, users) {
    console.log(i, users[i])
    hideModal()
    let user = users[i]
    let birthday = new Date(user.dob.date)
    let birthdayDay = String(birthday.getDate()).padStart(2, '0')
    let birthdayMonth = String(birthday.getMonth() + 1).padStart(2, '0')
    let birthdayYear = birthday.getFullYear()
    document.body.insertAdjacentHTML('beforeend',
        `<div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">
                        ${user.name.first} ${user.name.last}
                    </h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">
                        ${user.location.street.number} ${user.location.street.name},
                        ${user.location.city}, ${user.location.state}
                        ${user.location.postcode}
                    </p>
                    <p class="modal-text">
                        Birthday: ${birthdayMonth}/${birthdayDay}/${birthdayYear}
                    </p>
                </div>
            </div>
            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
    )

    let closeButton = document.querySelector('#modal-close-btn')
    closeButton.addEventListener('click', hideModal)

    let prevButton = document.querySelector('#modal-prev')
    if (i == 0) {
        prevButton.disabled = true
    }
    prevButton.addEventListener('click', function() {
        showModal(i-1, users)
    })

    let nextButton = document.querySelector('#modal-next')
    if (i == users.length - 1) {
        nextButton.disabled = true
    }
    nextButton.addEventListener('click', function() {
        showModal(i+1, users)
    })
}

function hideModal() {
    let modal = document.querySelector('.modal-container')
    if (modal) {
        modal.remove()
    }
}
