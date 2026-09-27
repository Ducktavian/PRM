import { people } from "../data.js";
const totalPeopleEl = document.getElementById("total-people");
const totalInteractionsThisMonthEl = document.getElementById("total-interactions-this-month");
const totalCategoriesEl = document.getElementById("total-categories");

document.addEventListener("DOMContentLoaded", () => {
    const totalPeople = getTotalPeople(people);
    const totalInteractionsThisMonth = getTotalInteractionsThisMonth(people);
    const categories = getCategories(people); // object
    const totalCategories = getTotalCategories(categories);

    // Display Info First 3 Cards
    totalPeopleEl.innerText = totalPeople;
    totalInteractionsThisMonthEl.innerText = totalInteractionsThisMonth;
    totalCategoriesEl.innerText = totalCategories;

    displayNetworkByCategory(categories)

    // Display Recent activity
    const interactions = getInteractions(people);
    const sortedInteractions = getSortedInteractions(interactions);
    displayRecentActivity(people, getRecentActivity(sortedInteractions))

})



function getTotalPeople(people) {
    return people.length;
}

function getTotalInteractionsThisMonth(people){
    let totalInteractions = 0;
    for (const person of people) {
        for (const interaction of person.interactions) {
            if (isInCurrentMonth(interaction.date)) {
                totalInteractions++;
            }
        }
    }
    return totalInteractions;
}

// Helper for getTotalInteractionsThisMonth
function isInCurrentMonth(dateString) {
    const targetDate = new Date(dateString);
    const now = new Date();

    if (isNaN(targetDate.getTime)) {
        return false; // Invalid date
    }

    return (
        targetDate.getFullYear() === now.getFullYear() &&
        targetDate.getMonth() === now.getMonth()
    );
}

function getCategories(people) {
    let categories = {};

    for (const person of people) {
        if (Object.hasOwn(categories, person.relationship.category)) {
            categories[person.relationship.category]++;
        } else {
            categories[person.relationship.category] = 1;
        }        
    }

    return categories;
}

function getTotalCategories(categories) {
    return Object.keys(categories).length;
}

// Network By Category
function displayNetworkByCategory(categories) {
    const networkByCategory = document.querySelector(".network-by-category div");

    let innerHTML = "";
    for (const category in categories) {
        innerHTML += `
        <div>
            <div class="category-info">
                <div>
                    <span class="circle"></span>
                    <span>${category}</span> 
                </div>
                
                <span>${categories[category]}</span>
            </div>
            <div class="background-bar">
                <div class="bar"></div>
            </div>
        </div>
        `
    }

    networkByCategory.innerHTML = innerHTML;
}




// Recent Activity //
function getInteractions(people) {
    const interactions = [];
    for (const person of people) {
        for (const interaction of person.interactions) {
            const copy = {...interaction, personId: person.id}
            interactions.push(copy);
        }
    }

    return interactions;
}

// Sort date and time
function getSortedInteractions(interactions) {
    return interactions.toSorted((a, b) => {
        const dateTimeA = new Date(`${a.date} ${a.time}`);
        const dateTimeB = new Date(`${b.date} ${b.time}`);

        return dateTimeA - dateTimeB;
    });
}

// returns the 5 Latest Interactions
function getRecentActivity(sortedInteractions) {
    return sortedInteractions.slice(-5);
}

function displayRecentActivity(people, recentActivity) {
    const recentActivityEl = document.querySelector(".recent-activity div");
    let innerHTML = "";
    for (const activity of recentActivity) {
        innerHTML += `
        <div class="activity">
            <div class="profile"></div>
            <div class="name--activity--date">
                <span>${getPersonFullName(people, activity.personId)}</span>
                <span>${activity.type}</span>
                <span>${activity.date}</span>
            </div>
            <div class="acitivity-title">${activity.title}</div>
        </div>
        `
    }

    recentActivityEl.innerHTML = innerHTML;
}



// Helper: Finds Person name
function getPersonFullName(people, id) {
    const foundPerson = people.find(person => person.id === id);
    return `${foundPerson.firstName} ${foundPerson.lastName}`;
}