document.addEventListener('DOMContentLoaded', function() {
    // Timeline data structure
    const timelineData = [
        {
            year: 1,
            title: "Foundation Strengthening",
            quarters: [
                {
                    id: "Y1Q1",
                    title: "Q1",
                    description: "Secure funding commitment and finalize expansion planning",
                    progress: 100, // Progress percentage (0-100)
                    status: "completed" // Status: "completed", "in-progress", "upcoming"
                },
                {
                    id: "Y1Q2",
                    title: "Q2",
                    description: "Recruit additional staff and begin partner agreements",
                    progress: 100,
                    status: "completed"
                },
                {
                    id: "Y1Q3",
                    title: "Q3",
                    description: "Launch expanded service offerings and begin infrastructure development",
                    progress: 100,
                    status: "completed"
                },
                {
                    id: "Y1Q4",
                    title: "Q4",
                    description: "Implement enhanced evaluation systems and report on initial outcomes",
                    progress: 75,
                    status: "in-progress"
                }
            ]
        },
        {
            year: 2,
            title: "Service Expansion",
            quarters: [
                {
                    id: "Y2Q1",
                    title: "Q1",
                    description: "Fully operationalize new service locations",
                    progress: 25,
                    status: "in-progress"
                },
                {
                    id: "Y2Q2",
                    title: "Q2",
                    description: "Expand program offerings and begin family healing initiatives",
                    progress: 0,
                    status: "upcoming"
                },
                {
                    id: "Y2Q3",
                    title: "Q3",
                    description: "Implement vocational training partnerships",
                    progress: 0,
                    status: "upcoming"
                },
                {
                    id: "Y2Q4",
                    title: "Q4",
                    description: "Evaluate expansion outcomes and adjust implementation",
                    progress: 0,
                    status: "upcoming"
                }
            ]
        },
        {
            year: 3,
            title: "Systemic Integration",
            quarters: [
                {
                    id: "Y3Q1",
                    title: "Q1",
                    description: "Establish formal agreements for sustainable funding",
                    progress: 0,
                    status: "upcoming"
                },
                {
                    id: "Y3Q2",
                    title: "Q2",
                    description: "Launch regional network of safe spaces",
                    progress: 0,
                    status: "upcoming"
                },
                {
                    id: "Y3Q3",
                    title: "Q3",
                    description: "Implement training academy for Indigenous youth workers",
                    progress: 0,
                    status: "upcoming"
                },
                {
                    id: "Y3Q4",
                    title: "Q4",
                    description: "Conduct comprehensive impact evaluation and plan for future growth",
                    progress: 0,
                    status: "upcoming"
                }
            ]
        }
    ];

    // DOM elements
    const timelineElement = document.getElementById('timeline');
    const currentYearTitle = document.getElementById('current-year-title');
    const prevYearButton = document.getElementById('prev-year');
    const nextYearButton = document.getElementById('next-year');
    const selectedQuarterElement = document.getElementById('selected-quarter');
    const quarterDescriptionElement = document.getElementById('quarter-description');

    // Current state
    let currentYearIndex = 0;
    let selectedQuarterId = null;

    // Initialize the timeline
    function initTimeline() {
        renderTimeline();
        updateNavigationButtons();
        
        // Select the first quarter by default
        if (timelineData[currentYearIndex].quarters.length > 0) {
            selectQuarter(timelineData[currentYearIndex].quarters[0]);
        }
    }

    // Render the timeline for the current year
    function renderTimeline() {
        const currentYear = timelineData[currentYearIndex];
        currentYearTitle.textContent = `Year ${currentYear.year}: ${currentYear.title}`;
        
        // Clear the timeline
        timelineElement.innerHTML = '';
        
        // Add quarters to the timeline
        currentYear.quarters.forEach((quarter, index) => {
            const quarterElement = document.createElement('div');
            quarterElement.classList.add('quarter');
            quarterElement.classList.add(`status-${quarter.status}`);
            quarterElement.dataset.id = quarter.id;
            
            if (quarter.id === selectedQuarterId) {
                quarterElement.classList.add('active');
            }
            
            quarterElement.innerHTML = `
                <div class="quarter-title">${quarter.title}</div>
                <div class="quarter-progress">
                    <div class="progress-bar" style="width: ${quarter.progress}%"></div>
                </div>
                <div class="quarter-status">${formatStatus(quarter.status)}</div>
            `;
            
            quarterElement.addEventListener('click', () => selectQuarter(quarter));
            
            // Add with animation delay
            quarterElement.style.animationDelay = `${index * 0.1}s`;
            quarterElement.classList.add('animate-in');
            
            timelineElement.appendChild(quarterElement);
        });
    }

    // Format the status text
    function formatStatus(status) {
        switch(status) {
            case 'completed':
                return 'Completed';
            case 'in-progress':
                return 'In Progress';
            case 'upcoming':
                return 'Upcoming';
            default:
                return '';
        }
    }

    // Select a quarter and display its details
    function selectQuarter(quarter) {
        selectedQuarterId = quarter.id;
        
        // Update the active class
        document.querySelectorAll('.quarter').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.id === quarter.id) {
                el.classList.add('active');
            }
        });
        
        // Update the quarter details
        selectedQuarterElement.textContent = `Year ${timelineData[currentYearIndex].year} - ${quarter.title}`;
        
        // Add status and progress information to the description
        const statusText = formatStatus(quarter.status);
        const progressText = `${quarter.progress}% complete`;
        
        quarterDescriptionElement.innerHTML = `
            <div class="status-badge status-${quarter.status}">${statusText}</div>
            <div class="progress-indicator">
                <div class="progress-bar" style="width: ${quarter.progress}%"></div>
                <span>${progressText}</span>
            </div>
            <p class="description-text">${quarter.description}</p>
        `;
        
        // Add animation
        quarterDescriptionElement.style.opacity = '0';
        setTimeout(() => {
            quarterDescriptionElement.style.opacity = '1';
        }, 50);
    }

    // Navigate to the previous year
    function navigateToPrevYear() {
        if (currentYearIndex > 0) {
            currentYearIndex--;
            selectedQuarterId = null;
            renderTimeline();
            updateNavigationButtons();
            
            // Select the first quarter by default
            if (timelineData[currentYearIndex].quarters.length > 0) {
                selectQuarter(timelineData[currentYearIndex].quarters[0]);
            } else {
                resetQuarterDetails();
            }
        }
    }

    // Navigate to the next year
    function navigateToNextYear() {
        if (currentYearIndex < timelineData.length - 1) {
            currentYearIndex++;
            selectedQuarterId = null;
            renderTimeline();
            updateNavigationButtons();
            
            // Select the first quarter by default
            if (timelineData[currentYearIndex].quarters.length > 0) {
                selectQuarter(timelineData[currentYearIndex].quarters[0]);
            } else {
                resetQuarterDetails();
            }
        }
    }

    // Update the navigation buttons based on current year
    function updateNavigationButtons() {
        prevYearButton.disabled = currentYearIndex === 0;
        nextYearButton.disabled = currentYearIndex === timelineData.length - 1;
    }

    // Reset the quarter details section
    function resetQuarterDetails() {
        selectedQuarterElement.textContent = 'Select a quarter to view details';
        quarterDescriptionElement.textContent = '';
    }

    // Event listeners
    prevYearButton.addEventListener('click', navigateToPrevYear);
    nextYearButton.addEventListener('click', navigateToNextYear);

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigateToPrevYear();
        } else if (e.key === 'ArrowRight') {
            navigateToNextYear();
        }
    });

    // Initialize the timeline
    initTimeline();
}); 