// ==UserScript==
// @name         Google Calendar More Timezones
// @namespace    https://github.com/yourname/gcal-more-timezones
// @version      1.0.0
// @description  Add more timezone bars to Google Calendar (specifically Argentina timezone)
// @author       yourname
// @match        https://calendar.google.com/calendar/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';
    const ARGENTINA_TIMEZONE_LABEL = 'Argentina';
    
    // Wait for the page to load and timezone bars to be present
    function waitForTimezones() {
        console.log('🕐 Setting up MutationObserver to watch for timezone bars...');
        
        const observer = new MutationObserver(function(mutations) {
            console.log('🔄 DOM mutation detected, checking for timezone bars...');
            checkAndAddArgentinianTimezone();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 MutationObserver set up successfully');
        
        // Also check immediately in case elements are already present
        console.log('🔍 Performing initial check for timezone bars...');
        checkAndAddArgentinianTimezone();
    }
    
    function checkAndAddArgentinianTimezone() {
        console.log('🔍 Starting timezone detection process...');
        
        // Look for timezone holder container
        const timezoneHolder = document.querySelector('.lqYlwe');
        
        if (!timezoneHolder) {
            console.log('❌ No timezone holder found (.lqYlwe) - calendar might not be in week/day view');
            return; // No timezone holder found, calendar might not be in week/day view
        }
        
        console.log('✅ Found timezone holder container:', timezoneHolder);
        console.log('📊 Timezone holder children count:', timezoneHolder.children.length);
        
        // Check if Argentine timezone already exists
        const existingArgentineTimezone = Array.from(timezoneHolder.children).find(child => 
            child.textContent && child.textContent.includes(ARGENTINA_TIMEZONE_LABEL)
        );
        
        if (existingArgentineTimezone) {
            console.log('⚠️ Argentina timezone already exists - skipping addition');
            return; // Argentina timezone already exists
        }
        
        console.log('✅ Argentina timezone not found - proceeding with addition');
        
        // Look for existing timezone bars
        const existingTimezoneBars = timezoneHolder.querySelectorAll('.R6TFwe');
        
        console.log('🔍 Found', existingTimezoneBars.length, 'existing timezone bars (.R6TFwe)');
        
        if (existingTimezoneBars.length === 0) {
            console.log('❌ No existing timezone bars to clone from - aborting');
            return; // No existing timezone bars to clone from
        }
        
        console.log('✅ Found timezone bars to clone from');
        
        // Clone the first timezone bar
        const firstTimezoneBar = existingTimezoneBars[0];
        console.log('📋 Cloning first timezone bar:', firstTimezoneBar);
        
        const argentinianTimezoneBar = firstTimezoneBar.cloneNode(true);
        console.log('✅ Successfully cloned timezone bar');
        
        // Update the Argentinian timezone bar
        console.log('🔄 Updating cloned timezone bar with Argentina data...');
        updateTimezoneBar(argentinianTimezoneBar, ARGENTINA_TIMEZONE, ARGENTINA_TIMEZONE_LABEL);
        
        // Add the new timezone bar to the container
        console.log('➕ Adding Argentina timezone bar to container...');
        timezoneHolder.appendChild(argentinianTimezoneBar);
        
        console.log('🎉 Successfully added Argentinian timezone bar to Google Calendar!');
        console.log('📍 Total timezone bars now:', timezoneHolder.querySelectorAll('.R6TFwe').length);
    }
    
    function updateTimezoneBar(timezoneBar, timezone, label) {
        // Update timezone label if there's a label element
        const labelElements = timezoneBar.querySelectorAll('*');
        labelElements.forEach(element => {
            if (element.textContent && element.textContent.match(/^[A-Z]{2,4}$/)) {
                element.textContent = 'ART'; // Argentina Time abbreviation
            }
        });
        
        // Update time slots with Argentina time
        const timeSlots = timezoneBar.querySelectorAll('.XsRa1c');
        timeSlots.forEach(slot => {
            updateTimeSlot(slot, timezone);
        });
        
        // Add a custom data attribute to identify our added timezone
        timezoneBar.setAttribute('data-custom-timezone', timezone);
        timezoneBar.setAttribute('data-custom-label', label);
    }
    
    function updateTimeSlot(slot, timezone) {
        // Find time display elements within the slot
        const timeElements = slot.querySelectorAll('*');
        timeElements.forEach(element => {
            const timeText = element.textContent;
            
            // Check if this element contains a time (looking for patterns like "12:00", "1 PM", etc.)
            if (timeText && timeText.match(/\d{1,2}:?\d{0,2}\s*(AM|PM)?/i)) {
                const argentineTime = convertToArgentineTime(timeText);
                if (argentineTime) {
                    element.textContent = argentineTime;
                }
            }
        });
    }
    
    function convertToArgentineTime(timeString) {
        try {
            // Get current date for context
            const now = new Date();
            
            // Parse the time string (this is a simplified approach)
            // In a real implementation, you'd need more sophisticated parsing
            const timeMatch = timeString.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i);
            if (!timeMatch) return null;
            
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2] || '0');
            const ampm = timeMatch[3];
            
            // Convert to 24-hour format
            if (ampm) {
                if (ampm.toLowerCase() === 'pm' && hours !== 12) {
                    hours += 12;
                } else if (ampm.toLowerCase() === 'am' && hours === 12) {
                    hours = 0;
                }
            }
            
            // Create a date object with the parsed time
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            
            // Convert to Argentina timezone
            const argentineTime = date.toLocaleString('en-US', {
                timeZone: ARGENTINA_TIMEZONE,
                hour: 'numeric',
                minute: '2-digit',
                hour12: false
            });
            
            return argentineTime;
            
        } catch (error) {
            console.error('Error converting time to Argentine timezone:', error);
            return null;
        }
    }
    
    // Periodic check to handle dynamic content updates
    function setupPeriodicCheck() {
        setInterval(checkAndAddArgentinianTimezone, 5000); // Check every 5 seconds
    }
    
    // Initialize the script
    function init() {
        console.log('Google Calendar More Timezones script initialized');
        
        // Wait a bit for the page to fully load
        setTimeout(() => {
            waitForTimezones();
            setupPeriodicCheck();
        }, 2000);
    }
    
    // Start the script
    init();
    
})();