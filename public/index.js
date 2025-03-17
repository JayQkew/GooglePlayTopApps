const eventSource = new EventSource('http://localhost:3000/db-update-progress');
const updateDatabaseBtn = document.querySelector('.update-database');
const progressBar = document.querySelector('.progress-bar');
const generateTableBtn = document.querySelector('.generate-table');

updateDatabaseBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    progressBar.classList.remove('hidden');
    await updateDatabase();
})

generateTableBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const dbApps = await getDbApps();
    const findApkApps = await getFindApkApps();
    // loop through dbApps and make a new array that has dbApps with findApk apps
    const allApps = dbApps.map(app => {
        const findApk = findApkApps.find(a => a.packageName == app.package_name);
        return {
            name: app.name,
            packageName: app.package_name,
            lastUpdated: app.last_updated ? app.last_updated : 'new release',
            gpVersion: app.version,
            findApkVersion: findApk ? findApk.versionName : null
        }
    });

    generateTable(allApps);
})

eventSource.onmessage = (e) => {
    const res = JSON.parse(e.data);
    const progressBar = document.querySelector('.progress');
    const progressText = progressBar.querySelector('p');

    const percentage = Math.round((res.current / res.total) * 100);
    
    progressBar.style.width = percentage + '%';
    progressText.innerText = percentage + '%';
    
    if (res.current === res.total) {
        console.log("Update Complete!");
        progressBar.classList.add('hidden');
        eventSource.close();
    }
}

async function updateDatabase(){
    try {
        const res = await fetch("/update-database");

        if(!res.ok) throw new Error('Failed to update database');
    } catch (error) {
        console.error("Error updating database:", error);
    }
}

async function getDbApps(){
    try {
        const res = await fetch('/db-apps');
        if(!res.ok) throw new Error('Failed to get db apps');
        const data = await res.json();
        return data.data;
    } catch (error){
        console.error("Error getting database apps: ", error);
    }
}

async function getFindApkApps(){
    try{
        const res = await fetch('/findApk-apps');
        if(!res.ok) throw new Error('Failed to get findApk apps');
        const data = await res.json();
        return data.data;
    } catch (error){
        console.error('Error getting findApk apps: ', error);
    }
}

//#region OLD CODE
async function getTopApps(){
    const formData = getFormData();

    try {
        console.log("Post start")
        const res = await fetch("/topApps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if(!res.ok){
            throw new Error("Failed to download file");
        }

        console.log("POST OK")
        const topApps = await res.json();
        console.log(topApps);
        const filteredApps = topApps.filter(app => {
            const timeStamp = new Date(app.updated);
            return filterDate(timeStamp, new Date(formData.startDate), new Date(formData.endDate));
        });

        const specifiedData = filteredApps.map(app => {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            }).format(new Date(app.updated)); // Format date properly
    
            return {
                Title: app.title,
                AppID: app.appId,
                Updated: formattedDate,
                Version: app.version,
                Url: app.url
            };
        })

        console.log("Table generation start");
        generateTable(specifiedData);
        console.log("Table generation end");

        const downloadBtn = document.querySelector('.download');
        downloadBtn.classList.remove('hidden');

    } catch (error) {
        console.error("Error submitting form:", error);
        return null;
    }

}

function filterDate(date, start, end) {
    // Convert input to Date objects
    date = new Date(date);
    start = start ? new Date(start) : null;
    end = end ? new Date(end) : null;

    // If `date` is invalid, return true (allow it to pass through)
    if (isNaN(date.getTime())) {
        console.warn("Warning: Invalid date detected, allowing through.");
        return true;
    }

    // If start or end is invalid, treat them as "no filter"
    const isStartValid = start && !isNaN(start.getTime());
    const isEndValid = end && !isNaN(end.getTime());

    // Apply filtering logic
    return (!isStartValid || date >= start) && (!isEndValid || date <= end);
}

function generateTable(data) {
    const table = document.getElementById('top-apps-table');
    table.innerHTML = '';

    const thead = document.createElement('thead');
    const hRow = document.createElement('tr');

    const cols = Object.keys(data[0]);

    cols.forEach((c, index) => {
        const th = document.createElement('th');
        th.textContent = c;
        th.setAttribute('data-column', c);
        th.setAttribute('data-order', 'desc');

        if (c === "Updated") {
            th.id = "update-header";
        }

        th.addEventListener('click', () => {
            sortTableByColumn(table, index, th);
        });

        hRow.appendChild(th);
    });

    thead.appendChild(hRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach(row => {
        const tr = document.createElement('tr');
        cols.forEach(c => {
            const td = document.createElement('td');

            if (c === "Url") {
                const link = document.createElement('a');
                link.href = row[c]; // Set href attribute
                link.textContent = "Open Link"; // Text inside the link
                link.target = "_blank"; // Open in new tab
                link.rel = "noopener noreferrer"; // Security best practice
                td.appendChild(link);
            } else {
                td.textContent = row[c];
            }

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

function exportTableToExcel(){
    const table = document.getElementById('top-apps-table'); // Assuming you're working with an HTML table

    // Convert the data into an array first, if needed
    const data = [];
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = [];
        for (let j = 0; j < row.cells.length; j++) {
            let cell = row.cells[j].innerText || row.cells[j].textContent;
            if (j === 3) { 
                cell = cell.toString();
            }
            rowData.push(cell);
        }
        data.push(rowData);
    }

    // Now convert the modified data into a sheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TopApps");

    XLSX.writeFile(wb, `top_apps_${Date.now()}.xlsx`);
}

document.querySelector('.download').addEventListener('click', exportTableToExcel);

function sortTableByColumn(table, columnIndex, header) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const order = header.getAttribute('data-order');
    const isAscending = order === 'asc';

    rows.sort((rowA, rowB) => {
        let cellA = rowA.children[columnIndex].textContent.trim();
        let cellB = rowB.children[columnIndex].textContent.trim();

        // Check if the column is a date
        const dateRegex = /\b\w{3}\s\d{2},\s\d{4}\b/; // Matches "Jan 01, 2024"
        if (dateRegex.test(cellA) && dateRegex.test(cellB)) {
            cellA = new Date(cellA);
            cellB = new Date(cellB);
        } else if (!isNaN(cellA) && !isNaN(cellB)) {
            // Convert numbers if the column contains numeric values
            cellA = parseFloat(cellA);
            cellB = parseFloat(cellB);
        }

        return isAscending ? cellA - cellB : cellB - cellA;
    });

    // Toggle order for next click
    header.setAttribute('data-order', isAscending ? 'desc' : 'asc');

    // Re-add sorted rows to tbody
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

//#endregion