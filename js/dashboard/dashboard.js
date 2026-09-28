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

    displayNetworkByCategory(categories);
    setNetworkCategoryBars(categories);

    // Display Recent activity
    const interactions = getInteractions(people);
    const sortedInteractions = getSortedInteractions(interactions);
    displayRecentActivity(people, getRecentActivity(sortedInteractions))

    // Reconnect Soon
    const oldestInteractions = getOldestInteractions(sortedInteractions);
    displayReconnectSoon(people, oldestInteractions);

    // Upcoming Important Dates
    const reminders = getActiveReminders(people);
    displayUpcomingImportantDates(people, reminders);
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
        <div class="network-by-category-item">
            <div class="category-info">
                <div>
                    <span class="circle"></span>
                    <span class="category-name">${category}</span> 
                </div>
                
                <span class="category-count">${categories[category]}</span>
            </div>
            <div class="background-bar">
                <div class="bar"></div>
            </div>
        </div>
        `
    }

    networkByCategory.innerHTML = innerHTML;
}



function setNetworkCategoryBars(categories) {
    // Gets the most amount of category type and set is as the basis for max bar
    let mostCategoryType = 0;
    for (const category in categories) {
        if (categories[category] > mostCategoryType) {
            mostCategoryType = categories[category]
        }
    }
    
    // apply bar styling
    const netWorkByCategoryElements = document.querySelectorAll(".network-by-category-item");
    
    for (const category of netWorkByCategoryElements) {
        const bar = category.querySelector(".bar");
        const categoryCount = +category.querySelector(".category-count").innerText;
        const width = categoryCount / mostCategoryType * 100;
        applyBarStyle(bar, width);
    }
}


function applyBarStyle(element, width) {
    element.style.width = `${width}%`;
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
            <div class="vertical-container">
                <div class="name--activity--date">
                    <span>
                        <span>${getPersonFullName(people, activity.personId)}</span>
                        <span>${activity.type}</span>
                    </span>
                    <span>${activity.date}</span>
                </div>
                <div class="acitivity-title">${activity.title}</div>
            </div>
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

function getPerson(people, id) {
    return people.find(person => person.id === id);
}









// Reconnect Soon
// Returns the last 4 people interacted with
function getOldestInteractions(sortedInteractions) {
    // Interactions are sorted from oldest to latest
    return sortedInteractions.slice(0, 4); 
}

function daysPassedLastInteraction(pastDate) {
    const now = new Date();
    const formattedPastDate = new Date(pastDate);

    // date in milliseconds
    const differenceInMs = now - formattedPastDate;

    const msPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = differenceInMs / msPerDay;

    return Math.floor(differenceInDays);
}


function displayReconnectSoon(people, oldestInteractions) {

    const reconnectSoonEl = document.querySelector(".reconnect-soon div");
    let innerHTML = "";

    for (const interaction of oldestInteractions) {
        const fullName = getPersonFullName(people, interaction.personId);
        const daysPassed = +daysPassedLastInteraction(interaction.date);

        innerHTML += `
        <div class="reconnect-item">
            <div class="profile"></div>
            <div class="vertical-container">
                <span>${fullName}</span>
                <span>${daysPassed} ${daysPassed === 1 ? "day" : "days"} ago</span>
            </div>
            <button>View</buton>
        </div>
         `
    }

    reconnectSoonEl.innerHTML = innerHTML;
}


// Upcoming Important Dates (Reminders)

function getActiveReminders(people) {
    const reminders = [];

    for (const person of people) {
        for (const reminder of person.reminders) {
            if (!reminder.completed) {
                reminders.push({...reminder, personId: person.id})
            }
        }
    }
    return reminders;
}

function displayUpcomingImportantDates(people, reminders) {
    const upcomingDatesEl = document.querySelector(".upcoming-important-dates div");
    let innerHTML = "";

    for (const reminder of reminders) {
        const person = getPerson(people, reminder.personId)
        innerHTML += `
        <div class="upcoming-important-dates-item">
            <div class="profile"></div>
            <div class="vertical-container">
                <span>${reminder.title}</span>
                <div>
                    <span>${reminder.date}</span>
                    <span>${person.relationship.category}</span>
                </div>
            </div>
        </div>
        
        `
    }

    upcomingDatesEl.innerHTML = innerHTML;
}


