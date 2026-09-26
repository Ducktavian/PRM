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