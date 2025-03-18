const nav = document.querySelector('nav');
const pages = [
    { name: "Home", href: "index.html"},
    { name: "Package Search", href: "package-search.html"}
]


function createNavBar(){
    const ul = document.createElement('ul');

    pages.map(page =>{
        const pageClass = (document.title === page.name) ? 'current-page' : '';

        const pageElement = `
            <li><a href="${page.href}" class="${pageClass}">${page.name}</a></li>
        `
        ul.innerHTML += pageElement;
    })

    nav.appendChild(ul);
}

createNavBar();