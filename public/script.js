function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scanButton').addEventListener('click', async () => {
       
        let statusArea = document.getElementById('scanStatusArea');
        
        if (!statusArea) {
            statusArea = document.createElement('div');
            statusArea.id = 'scanStatusArea';
            const resultDiv = document.getElementById('health-check');
            resultDiv.appendChild(statusArea); 
        }
        
        
        statusArea.innerHTML = '<p id="scanStatus">Scanning...</p>';

        try {
            const response = await fetch('http://localhost:3000/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ directory: 'C:\\Users\\YourUsername\\Documents' })
            });
            const data = await response.json();

            if (data.success) {
                statusArea.innerHTML = '<p id="scanStatus">Scan complete!</p>';
                if (data.threats && data.threats.length > 0) {
                    const threatList = data.threats.map(threat => `<li>${threat}</li>`).join('');
                    statusArea.innerHTML += `<ul>${threatList}</ul>`;
                } else {
                    statusArea.innerHTML += '<p>No threats found</p>';
                }
            } else {
                statusArea.innerHTML = '<p id="scanStatus">Scan failed</p>';
            }
        } catch (error) {
            statusArea.innerHTML = '<p id="scanStatus">Error during scan</p>';
            console.error('Error:', error);
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const statusArea = document.getElementById('scanStatusArea');

    scanButton.addEventListener('click', async () => {
        if (!statusArea) {
            statusArea = document.createElement('div');
            statusArea.id = 'scanStatusArea';
            const resultDiv = document.getElementById('health-check');
            resultDiv.appendChild(statusArea); 
        }

        statusArea.innerHTML = '<p id="scanStatus">Scanning...</p>';

        try {
            // Start scan
            const response = await fetch('http://localhost:3002/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            // Check response status
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                statusArea.innerHTML = '<p id="scanStatus">Scan complete!</p>';
                if (data.threats && data.threats.length > 0) {
                    const threatList = data.threats.map(threat => `<li>${threat}</li>`).join('');
                    statusArea.innerHTML += `<ul>${threatList}</ul>`;
                } else {
                    statusArea.innerHTML += '<p>No threats found</p>';
                }
            } else {
                statusArea.innerHTML = '<p id="scanStatus">Scan failed</p>';
            }
        } catch (error) {
            statusArea.innerHTML = '<p id="scanStatus">Error during scan</p>';
            console.error('Error:', error);
        }
    });

    // Polling for progress (optional)
    async function updateProgress() {
        try {
            const response = await fetch('http://localhost:3002/progress');
            const data = await response.json();
            
            const progressText = `Scanned ${data.scannedFiles} of ${data.totalFiles} files.`;
            document.getElementById('scanStatusArea').innerHTML = `<p>${progressText}</p>`;
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    }

    // Poll every 2 seconds
    setInterval(updateProgress, 2000);
});



//loader
document.addEventListener('DOMContentLoaded', function () {
    const scanButton = document.getElementById('scanButton');
    const loadingOverlay = document.getElementById('loading-overlay');

    scanButton.addEventListener('click', function () {
        // Show the loading overlay
        loadingOverlay.style.display = 'flex'; 

     
        fetch('/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  })
        })
        .then(response => response.json())
        .then(data => {
            
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            
            loadingOverlay.style.display = 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to show the selected section and hide others
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    // Event listeners for header buttons
    document.getElementById('healthStatusButton').addEventListener('click', () => {
        showSection('health-check');
    });

    document.getElementById('myAccountButton').addEventListener('click', () => {
        showSection('my-account');
    });

    // Initialize the default section
    showSection('health-check');
    const sidebarItems = document.querySelectorAll('#sidebar li');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('onclick').match(/'([^']+)'/)[1];
        showSection(sectionId);
    });
});

});



// Example function to update health metrics (You may update this function based on actual data)
function updateHealthMetrics(cpuUsage, memoryUsage, diskUsage) {
    document.getElementById('cpuUsage').style.width = cpuUsage + '%';
    document.getElementById('memoryUsage').style.width = memoryUsage + '%';
    document.getElementById('diskUsage').style.width = diskUsage + '%';

    document.getElementById('cpuUsageText').textContent = cpuUsage + '%';
    document.getElementById('memoryUsageText').textContent = memoryUsage + '%';
    document.getElementById('diskUsageText').textContent = diskUsage + '%';
}

// Example of updating health metrics
updateHealthMetrics(45, 65, 75);

// Example function to set account details
function setAccountDetails(name, email) {
    document.getElementById('userName').textContent = name;
    document.getElementById('userEmail').textContent = email;
}

// Example of setting account details
setAccountDetails('Jane Smith', 'janesmith@example.com');
``






