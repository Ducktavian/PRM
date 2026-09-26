import { people } from "../data.js";
const totalPeopleEl = document.getElementById("total-people");
const totalInteractionsThisMonthEl = document.getElementById("total-interactions-this-month");
const totalCategoriesEl = document.getElementById("total-categories");

document.addEventListener("DOMContentLoaded", () => {
    const totalPeople = getTotalPeople(people);
    const totalInteractionsThisMonth = getTotalInteractionsThisMonth(people);
    const totalCategories = getTotalCategories(people);

    totalPeopleEl.innerText = totalPeople;
    totalInteractionsThisMonthEl.innerText = totalInteractionsThisMonth;
    totalCategoriesEl.innerText = totalCategories;
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

function getTotalCategories(people) {
    let categories = new Set();

    for (const person of people) {
        categories.add(person.relationship.category);
    }

    return categories.size;
}