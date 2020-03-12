const userList = document.getElementById('gallery');
const searchBar = document.querySelector('.search-container');
const bodyElement = document.querySelector('body');


// Create a search bar and append it to the Dom dynamically
const search =
`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`
searchBar.innerHTML = search;
// Grab search bar input
const searchInput = document.getElementById('search-input');
searchInput.addEventListener("keyup", filterUsers);

function filterUsers() {
    // Grabs a list of all the users on the page
    let cardItems = document.querySelectorAll('.card');

    // used the spread operator in order to ????? grab the array of user card elements, and place them into an array defined as names. 
    let names = [...cardItems]
    
    // map through the list of names and grabs the inner HTML of each card item. 
    names.map(user => {
        // Trying to filler by just first and last name. 
        const fullName = user.querySelector("#name").innerText;
        console.log(fullName);
        if(user.innerText.indexOf(searchInput.value) > -1) {
            user.style.display = "";
        } else {
            user.style.display = "none";
        }
    })
    
}


// Grabs the 12 users data 
function fetchData(url){
    return fetch(url)
    .then(resp => resp.json())
}
fetchData('https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,dob,phone')
    .then(data => generateCardHTML(data.results))



// Create a function that will generate the 12 users, append them to the gallery div into cards dynamically. Also create HTML for the modal 
function generateCardHTML(data) {
    data.map(user => { 
        const cleanBirthday = formatBirthday(user.dob.date)
        const personList = document.createElement("div");
        personList.classList.add("card");
        userList.appendChild(personList);
        personList.innerHTML = `
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        ` ;
        // Creates the Modal for each user. 
        const modalDiv = document.createElement("div");
        modalDiv.classList.add("modal-container");
        modalDiv.setAttribute("style", "display: none");
        bodyElement.appendChild(modalDiv);
        modalDiv.innerHTML =`
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large} " alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${cleanBirthday}</p>
                </div> 
            </div>
        `;
    });      
}    

//  EVENT LISTENERS FOR THE DOM ELEMENTS
    // Create a click event for all items within the gallery 
    userList.addEventListener("click", (e) => {
        // Creates a variable to grab the names of each card element. 
        const userName = e.target.closest('.card').querySelector("#name").innerText;
        // Grabs all of the modal infos, returns as a node list, nodelist must be converted into array to use map. 
        const modalInfo = document.querySelectorAll(".modal #name");
        const arrInfo = [...modalInfo];
        arrInfo.map(user => {
            // Logic statement, I want the name of the user thats clicked to match the name of the modal, then show that modal 
            if(user.innerText === userName) {
                const showModal = user.parentNode.parentNode.parentNode;
                showModal.removeAttribute("style");
            }
        })

    })
     
   
// This assigns a click event to the modal window 
    // Must grab the entire body, for bubbling delegation
    bodyElement.addEventListener("click", (e) => {
        // Logic statement, to make sure that all elements clicked in the modal will close it. 
        if(e.target.className === "modal-close-btn" || e.target.innerText === "X"){
            const modalClose = e.target.closest('.modal-container')
            console.log(modalClose);
            modalClose.setAttribute("style", "display:none");
        };
    })

//validate birthday using regex
function formatBirthday(date) {
    date = date.replace(/[^\d]/g, "");
	let actualDate = date.substring(0,8);
	return actualDate.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1")
}
