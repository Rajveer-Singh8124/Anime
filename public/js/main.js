// nav bar
console.log("main.js");
const sections = document.querySelectorAll("section");
const navLink = document.querySelectorAll("nav a");

const resetLink = () =>
    navLink.forEach(link => {
        link.classList.remove("active");
    })

const handleScroll = () => {
    console.log("handleScrool");
    const { pageOffSet } = window;
    sections.forEach(section => {
        const { id, offsetTop, clientHeight } = section;
        const offset = offsetTop - 1;
        if (pageOffSet >= offset && pageOffSet < offset + clientHeight) {
            resetLink();
            navLink.forEach(link => {
                if (link.dataset.scroll === id) {
                    link.classList.add("active")
                }
            })
        }
    })
}

document.addEventListener("click", handleScroll);

// nav bar end

//  select box
const selectBox = document.querySelector(".select-box");
const selectInput = selectBox.querySelector(".select-input");
const dropdownList = selectBox.querySelector(".dropdown-list");
const options = Array.from(dropdownList.querySelectorAll(".option"));


selectInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    options.forEach(option => {
        const optionText = option.textContent.toLowerCase()

        if (optionText.indexOf(searchValue) > -1) {
            option.style.display = 'block';
        }
        else {
            option.style.display = 'none';
        }
    })
    dropdownList.classList.add('show');
})
selectInput.addEventListener("focus", function () {
    if (dropdownList.querySelector(".option:not([style*='display: none'])")) {
        dropdownList.classList.add("show")
    }
})
document.addEventListener("click", function (e) {
    if (!selectBox.contains(e.target)) {
        dropdownList.classList.remove("show")
    }
})
options.forEach(option => {
    option.addEventListener('click', function () {
        selectInput.value = option.textContent;
        dropdownList.classList.remove('show');
    })
}) 