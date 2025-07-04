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
    
    // Global flag to prevent multiple additions
    let argentinianTimezoneAdded = false;
    
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
        console.log('🚩 Global flag argentinianTimezoneAdded:', argentinianTimezoneAdded);
        
        // Check global flag first
        if (argentinianTimezoneAdded) {
            console.log('🛑 Argentina timezone already added (global flag) - skipping');
            return;
        }
        
        // Look for timezone holder container
        const timezoneHolder = document.querySelector('.lqYlwe');
        
        if (!timezoneHolder) {
            console.log('❌ No timezone holder found (.lqYlwe) - calendar might not be in week/day view');
            return; // No timezone holder found, calendar might not be in week/day view
        }
        
        console.log('✅ Found timezone holder container:', timezoneHolder);
        console.log('📊 Timezone holder children count:', timezoneHolder.children.length);
        
        // Check if Argentine timezone already exists using our custom data attribute
        const existingArgentineTimezone = timezoneHolder.querySelector('[data-custom-timezone="' + ARGENTINA_TIMEZONE + '"]');
        
        if (existingArgentineTimezone) {
            console.log('⚠️ Argentina timezone already exists (found by data attribute) - skipping addition');
            argentinianTimezoneAdded = true; // Set flag if we find existing one
            return; // Argentina timezone already exists
        }
        
        // Fallback: also check by text content
        const existingByText = Array.from(timezoneHolder.children).find(child => 
            child.textContent && child.textContent.includes(ARGENTINA_TIMEZONE_LABEL)
        );
        
        if (existingByText) {
            console.log('⚠️ Argentina timezone already exists (found by text content) - skipping addition');
            argentinianTimezoneAdded = true; // Set flag if we find existing one
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
        
        // Set the global flag to prevent future additions
        argentinianTimezoneAdded = true;
        console.log('🚩 Set global flag argentinianTimezoneAdded = true');
        
        console.log('🎉 Successfully added Argentinian timezone bar to Google Calendar!');
        console.log('📍 Total timezone bars now:', timezoneHolder.querySelectorAll('.R6TFwe').length);
    }
    
    function updateTimezoneBar(timezoneBar, timezone, label) {
        console.log('🔄 Starting timezone bar update process...');
        console.log('📍 Timezone:', timezone);
        console.log('🏷️ Label:', label);
        
        // Update timezone label if there's a label element
        const labelElements = timezoneBar.querySelectorAll('*');
        console.log('🔍 Found', labelElements.length, 'label elements to check');
        
        let labelsUpdated = 0;
        labelElements.forEach((element, index) => {
            if (element.textContent && element.textContent.match(/^[A-Z]{2,4}$/)) {
                console.log(`🏷️ Updating label element ${index}: "${element.textContent}" → "ART"`);
                element.textContent = 'ART'; // Argentina Time abbreviation
                labelsUpdated++;
            }
        });
        
        console.log(`✅ Updated ${labelsUpdated} timezone labels`);
        
        // Update time slots with Argentina time
        const timeSlots = timezoneBar.querySelectorAll('.XsRa1c');
        console.log('🕐 Found', timeSlots.length, 'time slots (.XsRa1c) to update');
        
        timeSlots.forEach((slot, index) => {
            console.log(`🕐 Updating time slot ${index + 1}/${timeSlots.length}...`);
            updateTimeSlot(slot, timezone);
        });
        
        // Add a custom data attribute to identify our added timezone
        console.log('🏷️ Adding custom data attributes...');
        timezoneBar.setAttribute('data-custom-timezone', timezone);
        timezoneBar.setAttribute('data-custom-label', label);
        
        console.log('✅ Timezone bar update completed successfully');
    }
    
    function updateTimeSlot(slot, timezone) {
        console.log('🕐 Processing time slot:', slot);
        
        // Find time display elements within the slot
        const timeElements = slot.querySelectorAll('*');
        console.log(`🔍 Found ${timeElements.length} elements in time slot`);
        
        let timesUpdated = 0;
        timeElements.forEach((element, index) => {
            const timeText = element.textContent;
            
            // Check if this element contains a time (looking for patterns like "12:00", "1 PM", etc.)
            if (timeText && timeText.match(/\d{1,2}:?\d{0,2}\s*(AM|PM)?/i)) {
                console.log(`⏰ Found time text in element ${index}: "${timeText}"`);
                
                const argentineTime = convertToArgentineTime(timeText);
                if (argentineTime) {
                    console.log(`🔄 Converting "${timeText}" → "${argentineTime}"`);
                    element.textContent = argentineTime;
                    timesUpdated++;
                } else {
                    console.log(`❌ Failed to convert time: "${timeText}"`);
                }
            }
        });
        
        console.log(`✅ Updated ${timesUpdated} times in this slot`);
    }
    
    function convertToArgentineTime(timeString) {
        console.log(`🔄 Converting time to Argentina timezone: "${timeString}"`);
        
        try {
            // Get current date for context
            const now = new Date();
            console.log(`📅 Current date context: ${now.toISOString()}`);
            
            // Parse the time string (this is a simplified approach)
            // In a real implementation, you'd need more sophisticated parsing
            const timeMatch = timeString.match(/(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i);
            if (!timeMatch) {
                console.log(`❌ No time pattern match found in: "${timeString}"`);
                return null;
            }
            
            console.log(`🎯 Time pattern matched:`, timeMatch);
            
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2] || '0');
            const ampm = timeMatch[3];
            
            console.log(`⏰ Parsed time components - Hours: ${hours}, Minutes: ${minutes}, AM/PM: ${ampm}`);
            
            // Convert to 24-hour format
            if (ampm) {
                if (ampm.toLowerCase() === 'pm' && hours !== 12) {
                    hours += 12;
                    console.log(`🌅 Converted PM time: ${hours}:${minutes}`);
                } else if (ampm.toLowerCase() === 'am' && hours === 12) {
                    hours = 0;
                    console.log(`🌙 Converted midnight: ${hours}:${minutes}`);
                }
            }
            
            // Create a date object with the parsed time
            const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
            console.log(`📅 Created date object: ${date.toISOString()}`);
            
            // Convert to Argentina timezone
            const argentineTime = date.toLocaleString('en-US', {
                timeZone: ARGENTINA_TIMEZONE,
                hour: 'numeric',
                minute: '2-digit',
                hour12: false
            });
            
            console.log(`🇦🇷 Argentina time result: "${argentineTime}"`);
            return argentineTime;
            
        } catch (error) {
            console.error('❌ Error converting time to Argentine timezone:', error);
            console.error('📊 Error details:', {
                timeString,
                errorMessage: error.message,
                errorStack: error.stack
            });
            return null;
        }
    }
    
    // Function to reset the flag when navigating to different views
    function resetFlagIfNeeded() {
        const timezoneHolder = document.querySelector('.lqYlwe');
        const existingArgentineTimezone = timezoneHolder?.querySelector('[data-custom-timezone="' + ARGENTINA_TIMEZONE + '"]');
        
        if (!existingArgentineTimezone && argentinianTimezoneAdded) {
            console.log('🔄 Argentina timezone no longer found, resetting flag...');
            argentinianTimezoneAdded = false;
        }
    }
    
    // Periodic check to handle dynamic content updates
    function setupPeriodicCheck() {
        console.log('⏰ Setting up periodic check (every 10 seconds)...');
        
        const intervalId = setInterval(() => {
            console.log('🔄 Periodic check: Looking for timezone bars...');
            resetFlagIfNeeded();
            checkAndAddArgentinianTimezone();
        }, 10000); // Check every 10 seconds (reduced frequency)
        
        console.log('✅ Periodic check set up with interval ID:', intervalId);
    }
    
    // Initialize the script
    function init() {
        console.log('🚀 Google Calendar More Timezones script initialized');
        console.log('📋 Configuration:');
        console.log('  - Target timezone:', ARGENTINA_TIMEZONE);
        console.log('  - Timezone label:', ARGENTINA_TIMEZONE_LABEL);
        console.log('  - URL:', window.location.href);
        console.log('  - User agent:', navigator.userAgent);
        
        // Wait a bit for the page to fully load
        console.log('⏳ Waiting 2 seconds for page to fully load...');
        setTimeout(() => {
            console.log('🔄 Starting timezone detection and periodic monitoring...');
            waitForTimezones();
            setupPeriodicCheck();
        }, 2000);
    }
    
    // Start the script
    console.log('🎬 Starting Google Calendar More Timezones script...');
    init();
    
})();