const nav = document.querySelector('nav');
const pages = [
    { name: "Home", href: "index.html"},
    { name: "App Search", href: "app-details.html"},
    { name: "Package Search", href: "single-search.html"},
]


function createNavBar(){
    const ul = document.createElement('ul');

    pages.map(page =>{
        const pageElement = `
            <li><a href="${page.href}">${page.name}</a></li>
        `
        ul.innerHTML += pageElement;
    })

    nav.appendChild(ul);
}

createNavBar();