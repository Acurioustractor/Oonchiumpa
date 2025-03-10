document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport on page load
    checkIfInViewport();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkIfInViewport);
    
    function checkIfInViewport() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // How much of the element needs to be visible
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
                
                // If this is a stat value, start the counter
                if (element.classList.contains('stat-value')) {
                    startCounter(element);
                }
            }
        });
    }
    
    // Number counter animation
    function startCounter(element) {
        if (element.classList.contains('counted')) return;
        
        element.classList.add('counted');
        
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 1500; // milliseconds
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const currentValue = Math.round(progress * target);
                
                // Handle percentage or regular numbers
                if (element.textContent.includes('%')) {
                    element.textContent = currentValue + '%';
                } else if (element.textContent.includes('$')) {
                    element.textContent = '$' + currentValue;
                } else {
                    element.textContent = currentValue.toLocaleString();
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure we end with the exact target value
                if (element.textContent.includes('%')) {
                    element.textContent = target + '%';
                } else if (element.textContent.includes('$')) {
                    element.textContent = '$' + target;
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Expandable sections
    const expandableHeaders = document.querySelectorAll('.expandable-header');
    
    expandableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on header
            this.classList.toggle('active');
            
            // Toggle active class on content
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });
    
    // Make the first expandable section active by default
    if (expandableHeaders.length > 0) {
        expandableHeaders[0].classList.add('active');
        expandableHeaders[0].nextElementSibling.classList.add('active');
    }
    
    // Partner cards modal
    const partnerCards = document.querySelectorAll('.partner-card');
    const partnerModal = document.getElementById('partner-modal');
    const partnerModalTitle = document.getElementById('modal-title');
    const partnerModalContent = document.getElementById('modal-content');
    
    if (partnerCards.length > 0 && partnerModal) {
        // Partner details data
        const partnerDetails = {
            'lhere-artepe': {
                title: 'Lhere Artepe Aboriginal Corporation',
                content: `
                    <p>Lhere Artepe Aboriginal Corporation is the representative body for the traditional owners of Alice Springs. Our partnership focuses on justice reinvestment initiatives that divert youth from the criminal justice system.</p>
                    <p>Key collaboration areas:</p>
                    <ul>
                        <li>Cultural authority and guidance for youth programs</li>
                        <li>Co-designed diversion activities</li>
                        <li>Community consultation and engagement</li>
                    </ul>
                `
            },
            'naaja': {
                title: 'North Australian Aboriginal Justice Agency',
                content: `
                    <p>NAAJA provides legal services to Aboriginal people in the Northern Territory. Our partnership ensures youth have access to legal support and advocacy when needed.</p>
                    <p>Key collaboration areas:</p>
                    <ul>
                        <li>Legal representation for at-risk youth</li>
                        <li>Legal education workshops</li>
                        <li>Advocacy for systemic change</li>
                    </ul>
                `
            },
            'akeyulerre': {
                title: 'Akeyulerre Healing Centre',
                content: `
                    <p>Akeyulerre Healing Centre is an Arrernte-led organization that supports cultural healing and wellbeing. Our partnership strengthens the cultural foundation of our programs.</p>
                    <p>Key collaboration areas:</p>
                    <ul>
                        <li>Traditional healing practices</li>
                        <li>Cultural mentorship</li>
                        <li>Bush medicine and cultural knowledge</li>
                    </ul>
                `
            },
            'alg': {
                title: 'Aboriginal Leadership Group',
                content: `
                    <p>The Aboriginal Leadership Group provides guidance on community priorities and governance. This partnership ensures our work aligns with community needs and aspirations.</p>
                    <p>Key collaboration areas:</p>
                    <ul>
                        <li>Strategic direction and oversight</li>
                        <li>Community consultation</li>
                        <li>Advocacy with government stakeholders</li>
                    </ul>
                `
            },
            'police': {
                title: 'Alice Springs Police',
                content: `
                    <p>Our partnership with Alice Springs Police focuses on coordinated responses to youth issues, with an emphasis on diversion rather than enforcement.</p>
                    <p>Key collaboration areas:</p>
                    <ul>
                        <li>Referral pathways for at-risk youth</li>
                        <li>Data sharing on youth presence in public spaces</li>
                        <li>Joint outreach during high-risk periods</li>
                    </ul>
                `
            }
        };
        
        partnerCards.forEach(card => {
            card.addEventListener('click', function() {
                const partnerId = this.getAttribute('data-partner');
                const partnerData = partnerDetails[partnerId];
                
                if (partnerData) {
                    partnerModalTitle.textContent = partnerData.title;
                    partnerModalContent.innerHTML = partnerData.content;
                    partnerModal.style.display = 'block';
                }
            });
        });
    }
    
    // Testimonial buttons
    const testimonialButtons = document.querySelectorAll('.testimonial-button');
    const testimonialModal = document.getElementById('testimonial-modal');
    
    if (testimonialButtons.length > 0 && testimonialModal) {
        testimonialButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                testimonialModal.style.display = 'block';
            });
        });
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}); 