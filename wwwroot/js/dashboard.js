// Configuration
const DASHBOARD_CFG = window.DASHBOARD_CFG || {};
const GET_FILE_CONTENT_URL = DASHBOARD_CFG.getFileContentUrl || '/Dashboard/GetFileContent';
// Track selected files for deletion
const SELECTED_FILE_IDS = new Set();

// Function to toggle dropdowns
// Store original parent anchors so we can restore when hiding
const DROPDOWN_ANCHORS = {}; // key: `${id}-dropdown` => parentElement
function toggleDropdown(id, evt) {
    if (evt) evt.stopPropagation();
    const dropdown = document.getElementById(`${id}-dropdown`);
    
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== `${id}-dropdown`) {
            menu.classList.remove('show');
        }

// Selection checkbox handler (global)
function onFileCheckboxChange(checkbox) {
    const idAttr = checkbox.getAttribute('data-file-id');
    const id = idAttr ? parseInt(idAttr) : NaN;
    if (Number.isNaN(id)) return;

    const card = checkbox.closest('.file-card');
    if (checkbox.checked) {
        SELECTED_FILE_IDS.add(id);
        if (card) card.classList.add('selected');
    } else {
        SELECTED_FILE_IDS.delete(id);
        if (card) card.classList.remove('selected');
    }
}

// Delete selected files (global)
function deleteSelectedFiles() {
    if (SELECTED_FILE_IDS.size === 0) {
        alert('Please select at least one file to delete.');
        return;
    }
    if (!confirm('Delete selected file(s)? This action cannot be undone.')) {
        return;
    }

    const ids = Array.from(SELECTED_FILE_IDS);
    fetch('/Dashboard/DeleteFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(ids)
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.error || 'Delete failed');
            // Remove deleted cards from DOM
            ids.forEach(id => {
                const card = document.querySelector(`.file-card[data-file-id="${id}"]`);
                if (card && card.parentElement) card.parentElement.removeChild(card);
            });
            SELECTED_FILE_IDS.clear();
            const grid = document.querySelector('.files-grid');
            if (!grid || grid.children.length === 0) {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            alert('Failed to delete files.');
        });
}
    });
    
    const willShow = !dropdown.classList.contains('show');
    dropdown.classList.toggle('show');

    // Smart positioning for ANY topbar dropdown to keep within viewport
    try {
        const trigger = evt?.currentTarget || document.querySelector(`button.nav-btn[onclick*="toggleDropdown('${id}')"]`);
        if (trigger) {
            if (dropdown.classList.contains('show')) {
                const key = `${id}-dropdown`;
                if (!DROPDOWN_ANCHORS[key]) {
                    DROPDOWN_ANCHORS[key] = dropdown.parentElement;
                }
                if (dropdown.parentElement !== document.body) {
                    document.body.appendChild(dropdown);
                }
                const rect = trigger.getBoundingClientRect();
                dropdown.style.position = 'fixed';
                dropdown.style.top = `${rect.bottom + 8}px`;
                // Align right edge of dropdown with button right edge, clamped to viewport
                dropdown.style.left = 'auto';
                dropdown.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
                dropdown.style.transform = 'none';
                dropdown.style.zIndex = 1200;
                dropdown.style.maxHeight = '70vh';
                dropdown.style.overflow = 'visible';
            } else {
                // Clear inline styles when hiding and restore to original parent
                dropdown.style.position = '';
                dropdown.style.top = '';
                dropdown.style.left = '';
                dropdown.style.right = '';
                dropdown.style.transform = '';
                dropdown.style.zIndex = '';
                dropdown.style.maxHeight = '';
                dropdown.style.overflow = '';
                const key = `${id}-dropdown`;
                if (DROPDOWN_ANCHORS[key] && dropdown.parentElement === document.body) {
                    DROPDOWN_ANCHORS[key].appendChild(dropdown);
                }
            }
        }
    } catch (e) {
        console.warn('Dropdown positioning failed:', id, e);
    }
}

// Reposition any open dropdowns on resize/scroll
['resize','scroll'].forEach(evtName => {
    window.addEventListener(evtName, () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            const id = dropdown.id.replace('-dropdown','');
            const trigger = document.querySelector(`button.nav-btn[onclick*="toggleDropdown('${id}')"]`);
            if (trigger) {
                const rect = trigger.getBoundingClientRect();
                dropdown.style.position = 'fixed';
                dropdown.style.top = `${rect.bottom + 8}px`;
                dropdown.style.left = 'auto';
                dropdown.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
                dropdown.style.transform = 'none';
                dropdown.style.zIndex = 1200;
                dropdown.style.maxHeight = '70vh';
                dropdown.style.overflow = 'visible';
            }
        });
    });
});

// Toggle an inline panel inside a dropdown (e.g., Timer inside Focus)
function toggleInlinePanel(panelId, event) {
    if (event) event.stopPropagation();
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Close other inline panels
    document.querySelectorAll('.dropdown-menu.inline-left.show, .dropdown-menu.inline-left-from-focus.show').forEach(p => {
        if (p.id !== panelId) p.classList.remove('show');
    });

    const willShow = !panel.classList.contains('show');
    panel.classList.toggle('show');

    // If showing, position panel relative to the Focus dropdown within viewport
    if (willShow && panel.classList.contains('show')) {
        const focusDropdown = document.getElementById('focus-dropdown');
        if (focusDropdown) {
            // Ensure the main Focus dropdown stays open
            if (!focusDropdown.classList.contains('show')) {
                focusDropdown.classList.add('show');
            }
            const rect = focusDropdown.getBoundingClientRect();
            panel.style.position = 'fixed';
            panel.style.top = `${Math.max(8, rect.top)}px`;
            // Fixed width to compute left position safely
            const panelWidth = 360;
            const desiredLeft = rect.left - panelWidth - 8; // to the left of dropdown
            const left = Math.max(8, Math.min(desiredLeft, window.innerWidth - panelWidth - 8));
            panel.style.left = `${left}px`;
            panel.style.right = 'auto';
            panel.style.width = `${panelWidth}px`;
            panel.style.transform = 'none';
            panel.style.zIndex = 2000;
            panel.style.maxHeight = '70vh';
            panel.style.overflow = 'auto';
            panel.style.minWidth = '';
        }
    } else {
        // Clear inline styles when hiding
        panel.style.position = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.transform = '';
        panel.style.zIndex = '';
        panel.style.maxHeight = '';
        panel.style.overflow = '';
        panel.style.minWidth = '';
    }
}

// Centralized view manager for the left pane
function setLeftView(mode) {
    const uploadContainer = document.getElementById('upload-container');
    const fileDisplayContainer = document.getElementById('file-display-container');
    const manualText = document.getElementById('manual-text');
    const uploadedSection = document.getElementById('uploaded-files-section');

    if (uploadContainer) uploadContainer.style.display = (mode === 'upload') ? 'flex' : 'none';
    if (fileDisplayContainer) fileDisplayContainer.style.display = (mode === 'viewer') ? 'flex' : 'none';
    if (manualText) manualText.style.display = (mode === 'manual') ? 'block' : 'none';
    if (uploadedSection) uploadedSection.style.display = (mode === 'files') ? 'block' : 'none';

    // Set a mode class on body to allow CSS to enforce visibility
    const body = document.body;
    if (body) {
        body.classList.remove('mode-upload','mode-viewer','mode-manual','mode-files');
        body.classList.add(`mode-${mode}`);
    }
}

// Show the files list as the main view in the left section
function showMyFiles() {
    setLeftView('files');
    const fileDisplayContainer = document.getElementById('file-display-container');
    const uploadedSection = document.getElementById('uploaded-files-section');
    const uploadContainer = document.getElementById('upload-container');
    const titleEl = document.getElementById('uploaded-files-title-text');
    if (fileDisplayContainer) fileDisplayContainer.style.display = 'none';
    if (uploadContainer) uploadContainer.style.display = 'none';
    if (uploadedSection) uploadedSection.style.display = 'block';
    // Reset any filtering
    const grid = uploadedSection ? uploadedSection.querySelector('.files-grid') : null;
    if (grid) Array.from(grid.children).forEach(card => card.style.display = '');
    if (titleEl) titleEl.textContent = 'Your Files';
}

// Close dropdowns when clicking elsewhere
window.onclick = function (event) {
    // Don't close if clicking inside a dropdown or on a dropdown toggle
    if (event.target.closest('.dropdown-menu') || event.target.closest('.dropdown-toggle') || event.target.closest('.nav-btn')) {
        return;
    }

    const dropdowns = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}

// ======= Focus Timer Logic =======
const TIMER = {
    durationMs: 25 * 60 * 1000,
    remainingMs: 25 * 60 * 1000,
    running: false,
    intervalId: null,
    endTs: null
};

function formatMMSS(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function getRemainingTimeEl() {
    try {
        const panel = document.getElementById('focus-timer-panel');
        if (!panel) return null;
        // Find the item whose title text is 'Remaining Time'
        const titles = panel.querySelectorAll('.activity-title');
        for (const t of titles) {
            if ((t.textContent || '').trim().toLowerCase() === 'remaining time') {
                const desc = t.parentElement?.querySelector('.activity-desc');
                if (desc) return desc;
            }
        }
        // Fallback: first .activity-desc inside panel
        return panel.querySelector('.activity-desc');
    } catch { return null; }
}

function updateTimerDisplay() {
    const el = getRemainingTimeEl();
    if (el) el.textContent = formatMMSS(TIMER.remainingMs);
}

function stopTimerInterval() {
    if (TIMER.intervalId) {
        clearInterval(TIMER.intervalId);
        TIMER.intervalId = null;
    }
}

function startTimer() {
    if (TIMER.running) return;
    if (TIMER.remainingMs <= 0) TIMER.remainingMs = TIMER.durationMs;
    TIMER.running = true;
    TIMER.endTs = Date.now() + TIMER.remainingMs;
    stopTimerInterval();
    TIMER.intervalId = setInterval(() => {
        const now = Date.now();
        TIMER.remainingMs = Math.max(0, TIMER.endTs - now);
        updateTimerDisplay();
        if (TIMER.remainingMs <= 0) {
            stopTimerInterval();
            TIMER.running = false;
        }
    }, 250);
}

function pauseTimer() {
    if (!TIMER.running) return;
    stopTimerInterval();
    TIMER.running = false;
    TIMER.remainingMs = Math.max(0, TIMER.endTs - Date.now());
    updateTimerDisplay();
}

function resetTimer() {
    stopTimerInterval();
    TIMER.running = false;
    TIMER.remainingMs = TIMER.durationMs;
    updateTimerDisplay();
}

// Presets
document.querySelectorAll('.timer-preset').forEach(preset => {
    preset.addEventListener('click', function () {
        document.querySelectorAll('.timer-preset').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const minutes = parseInt(this.getAttribute('data-minutes')) || 25;
        TIMER.durationMs = minutes * 60 * 1000;
        TIMER.remainingMs = TIMER.durationMs;
        stopTimerInterval();
        TIMER.running = false;
        updateTimerDisplay();
    });
});

// Bind Start/Pause/Reset buttons inside the timer panel
document.addEventListener('DOMContentLoaded', function () {
    // Initialize display
    updateTimerDisplay();
    const panel = document.getElementById('focus-timer-panel');
    if (!panel) return;
    const startBtn = panel.querySelector('button .bi-play')?.closest('button');
    const pauseBtn = panel.querySelector('button .bi-pause')?.closest('button');
    const resetBtn = panel.querySelector('button .bi-arrow-clockwise')?.closest('button');
    if (startBtn) startBtn.addEventListener('click', (e) => { e.stopPropagation(); startTimer(); });
    if (pauseBtn) pauseBtn.addEventListener('click', (e) => { e.stopPropagation(); pauseTimer(); });
    if (resetBtn) resetBtn.addEventListener('click', (e) => { e.stopPropagation(); resetTimer(); });
});

// Navigation functionality
const navLinks = document.querySelectorAll('.left-nav .nav-link');

const contentMap = {
    summary: '<h5><strong>Summary</strong></h5><p>This is where the summary will appear...</p>',
    flashcards: '<h5><strong>Flashcards</strong></h5><p>Generated flashcards go here.</p>',
    workbook: '<h5><strong>Workbook</strong></h5><p>Workbook content and exercises go here.</p>',
    quizzes: '<h5><strong>Quizzes</strong></h5><p>Questions here related to the document.</p>',
    ai: '<h5><strong>AI Assistant</strong></h5><p>Interact with the AI here.</p>'
};

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const section = this.getAttribute('data-section');
        sectionContent.innerHTML = contentMap[section] || '';
    });
});

function handleFileSelection(input) {
    const fileInfo = document.getElementById('file-info');
    if (input.files.length > 0) {
        const file = input.files[0];
        const name = file.name.toLowerCase();
        const isImage = (/\.(png|jpg|jpeg|gif)$/i).test(name) || (file.type && file.type.startsWith('image/'));
        const icon = isImage ? 'image' : 'file-text';
        const label = isImage ? 'Image' : 'Document';
        fileInfo.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <i class="bi bi-${icon} me-2"></i>
                            <strong>${file.name}</strong> (${formatFileSize(file.size)})
                        </div>
                        <button type="submit" class="btn btn-primary btn-sm">
                            Process ${label}
                        </button>
                    </div>`;
        fileInfo.classList.add('show');
    } else {
        fileInfo.innerHTML = '';
        fileInfo.classList.remove('show');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function resetUpload() {
    setLeftView('upload');

    // Reset form and info
    document.getElementById('file-info').innerHTML = '';
    document.getElementById('file-info').classList.remove('show');
    document.getElementById('file-upload').value = '';
    // No separate image input anymore
}

function toggleTextInput() {
    const manualText = document.getElementById('manual-text');
    const isHidden = manualText && manualText.style.display === 'none';
    setLeftView(isHidden ? 'manual' : 'upload');
}

function submitManualText() {
    const textArea = document.querySelector('#manual-text textarea');
    const contentDisplay = document.getElementById('content-display');
    const manualText = document.getElementById('manual-text');
    const fileDisplayContainer = document.getElementById('file-display-container');

    if (textArea.value.trim() !== '') {
        const fileNameDisplay = document.querySelector('.filename-display');
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'Manual Text';
        }
        contentDisplay.textContent = textArea.value;

        // Hide manual text input
        manualText.style.display = 'none';
        // Show file display container
        fileDisplayContainer.style.display = 'flex';

        // Update word count and format text
        updateWordCount();
        formatDisplayedText();
    } else {
        alert('Please enter some text before submitting.');
    }
}

function formatDisplayedText() {
    const contentDisplay = document.getElementById('content-display');
    if (contentDisplay) {
        let text = contentDisplay.textContent || contentDisplay.innerText;
        if (text) {
            // Replace multiple newlines with paragraph breaks
            text = text.replace(/\n\s*\n/g, '</p><p>');
            // Replace single newlines with line breaks
            text = text.replace(/\n/g, '<br>');
            // Wrap in paragraphs if not already wrapped
            if (!text.startsWith('<p>')) {
                text = '<p>' + text + '</p>';
            }
            contentDisplay.innerHTML = text;
        }
    }
}

function formatTextWithLineBreaks(text) {
    return text.replace(/\n/g, '<br>');
}

function showUploadedFile(filename, content) {
    const fileDisplay = document.getElementById('file-display-container');
    const fileNameDisplay = document.querySelector('.filename-display');
    const contentDisplay = document.getElementById('content-display');

    if (fileNameDisplay) {
        fileNameDisplay.textContent = filename;
    }
    contentDisplay.innerHTML = formatTextWithLineBreaks(content);
    fileDisplay.style.display = 'flex';
    document.getElementById('upload-container').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const fileDisplayContainer = document.getElementById('file-display-container');
    const contentDisplay = document.getElementById('content-display');
    const uploadedSection = document.getElementById('uploaded-files-section');

    if (fileDisplayContainer.style.display === 'flex' && contentDisplay) {
        if (uploadedSection) uploadedSection.style.display = 'none';
        formatDisplayedText();
        updateWordCount();
    }
});

let currentFontSize = 1.1;
let currentLineHeight = 1.8;
let isDarkMode = false;
let isReadingMode = false;

function adjustFontSize(action) {
    const contentText = document.querySelector('.content-text');
    if (action === 'increase' && currentFontSize < 1.5) {
        currentFontSize += 0.1;
    } else if (action === 'decrease' && currentFontSize > 0.8) {
        currentFontSize -= 0.1;
    }
    contentText.style.fontSize = `${currentFontSize}rem`;
}

function toggleLineHeight() {
    const contentText = document.querySelector('.content-text');
    currentLineHeight = currentLineHeight === 1.8 ? 2.2 : 1.8;
    contentText.style.lineHeight = currentLineHeight;
}

function updateWordCount() {
    const contentDisplay = document.getElementById('content-display');
    const wordCountElement = document.getElementById('word-count');
    if (contentDisplay && wordCountElement) {
        const text = contentDisplay.textContent || '';
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

        // Animate the word count
        const currentCount = parseInt(wordCountElement.textContent.split(' ')[0]) || 0;
        animateNumber(currentCount, wordCount, (count) => {
            wordCountElement.textContent = `<i class="bi bi-hash me-1"></i>${count} words`;
        });
        updateReadTime(wordCount);
    }
}

function updateReadTime(wordCount) {
    const readTimeElement = document.getElementById('read-time');
    const minutes = Math.ceil(wordCount / 200);
    readTimeElement.textContent = `<i class="bi bi-clock me-1"></i>${minutes} min read`;
}

function animateNumber(start, end, callback) {
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        callback(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function downloadContent() {
    const content = document.getElementById('content-display').textContent;
    const fileNameDisplay = document.querySelector('.filename-display');
    const filename = fileNameDisplay ? fileNameDisplay.textContent : 'document.txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function shareContent() {
    if (navigator.share) {
        const fileNameDisplay = document.querySelector('.filename-display');
        const filename = fileNameDisplay ? fileNameDisplay.textContent : 'Document';
        navigator.share({
            title: filename,
            text: document.getElementById('content-display').textContent,
        }).catch(console.error);
    }
}

function toggleDarkMode() {
    const contentWrapper = document.getElementById('content-wrapper');
    isDarkMode = !isDarkMode;
    contentWrapper.classList.toggle('dark-mode');
}

function toggleReadingMode() {
    const contentDisplay = document.getElementById('content-display');
    isReadingMode = !isReadingMode;
    contentDisplay.classList.toggle('reading-mode');
}

function setTextAlign(alignment) {
    const contentDisplay = document.getElementById('content-display');
    contentDisplay.style.textAlign = alignment;

    // Update active state of alignment buttons
    document.querySelectorAll('.content-toolbar .btn-group:first-child .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Function to open uploaded files
function openFile(fileId) {
    // Switch to viewer mode
    setLeftView('viewer');
    // Show loading state
    const fileDisplayContainer = document.getElementById('file-display-container');
    const contentDisplay = document.getElementById('content-display');
    const fileNameDisplay = document.querySelector('.filename-display');

    if (contentDisplay && fileNameDisplay) {
        fileNameDisplay.textContent = 'Loading...';
        contentDisplay.innerHTML = '<div class="text-center p-4"><i class="bi bi-hourglass-split text-primary" style="font-size: 2rem;"></i><p class="mt-2">Loading file content...</p></div>';
    }

    // Make AJAX call to get file content
    const url = `${GET_FILE_CONTENT_URL}?fileId=${fileId}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin' // ensure cookies/session are sent
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to load file');
        })
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Failed to load file');
            }

            // Update the display
            if (contentDisplay && fileNameDisplay) {
                fileNameDisplay.textContent = data.fileName;

                if (data.displayType === 'image') {
                    contentDisplay.innerHTML = `<div class="text-center p-4"><img src="${data.content}" alt="${data.fileName}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"></div>`;
                } else if (data.displayType === 'pdf') {
                    // Inline PDF using iframe
                    contentDisplay.innerHTML = `
                        <div class="p-2" style="height: calc(100vh - 260px);">
                            <iframe src="${data.content}#view=fitH" style="width:100%; height:100%; border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"></iframe>
                        </div>`;
                } else if (data.displayType === 'text') {
                    contentDisplay.innerHTML = formatTextWithLineBreaks(data.content || '');
                    if (data.truncated) {
                        const notice = document.createElement('div');
                        notice.className = 'text-muted small mt-2';
                        notice.innerHTML = '<i class="bi bi-info-circle me-1"></i>Displayed content is truncated for performance.';
                        contentDisplay.parentElement.appendChild(notice);
                    }
                } else {
                    contentDisplay.innerHTML = `<div class="text-center p-4"><p class="text-muted">${data.content || 'Preview not available for this file type.'}</p></div>`;
                }

                // Update word count if function exists
                if (typeof updateWordCount === 'function') {
                    updateWordCount();
                }
                // Track as recent
                try { addRecentFile(fileId, data.fileName); } catch (_) { }
            }
        })
        .catch(error => {
            console.error('Error loading file:', error);
            if (contentDisplay && fileNameDisplay) {
                fileNameDisplay.textContent = 'Error Loading File';
                contentDisplay.innerHTML = `<div class="text-center p-4 text-danger"><i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i><p class="mt-2">${error.message || 'Failed to load file content'}</p></div>`;
            }
        });
}

// ===== Recent files (localStorage) =====
const RECENT_KEY = 'adhd_recent_files';
const RECENT_MAX = 10;

function getRecentFiles() {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        if (Array.isArray(arr)) return arr;
    } catch (_) { }
    return [];
}

function saveRecentFiles(list) {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (_) { }
}

function addRecentFile(id, name) {
    const now = Date.now();
    let list = getRecentFiles().filter(x => x && typeof x.id === 'number');
    // Remove if exists
    list = list.filter(x => x.id !== id);
    // Add to front
    list.unshift({ id, name, ts: now });
    // Trim
    if (list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
    saveRecentFiles(list);
}

// Show only recent files in the left list
function showRecentFiles() {
    setLeftView('files');
    const uploadedSection = document.getElementById('uploaded-files-section');
    const grid = uploadedSection ? uploadedSection.querySelector('.files-grid') : null;
    const titleEl = document.getElementById('uploaded-files-title-text');
    if (titleEl) titleEl.textContent = 'Your Recent Files';
    if (!grid) return;
    const recent = getRecentFiles();
    const recentIds = new Set(recent.map(r => r.id));
    // If no recent, show all
    if (recentIds.size === 0) {
        Array.from(grid.children).forEach(card => card.style.display = '');
        return;
    }
    Array.from(grid.children).forEach(card => {
        const idAttr = card.getAttribute('data-file-id');
        const id = idAttr ? parseInt(idAttr) : NaN;
        card.style.display = recentIds.has(id) ? '' : 'none';
    });
}

// Global: handle selection checkbox on file cards
function onFileCheckboxChange(checkbox) {
    const idAttr = checkbox.getAttribute('data-file-id');
    const id = idAttr ? parseInt(idAttr) : NaN;
    if (Number.isNaN(id)) return;

    const card = checkbox.closest('.file-card');
    if (checkbox.checked) {
        SELECTED_FILE_IDS.add(id);
        if (card) card.classList.add('selected');
    } else {
        SELECTED_FILE_IDS.delete(id);
        if (card) card.classList.remove('selected');
    }
}

// Global: delete selected files
function deleteSelectedFiles() {
    if (SELECTED_FILE_IDS.size === 0) {
        alert('Please select at least one file to delete.');
        return;
    }
    if (!confirm('Delete selected file(s)? This action cannot be undone.')) {
        return;
    }

    const ids = Array.from(SELECTED_FILE_IDS);
    fetch('/Dashboard/DeleteFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(ids)
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.error || 'Delete failed');
            ids.forEach(id => {
                const card = document.querySelector(`.file-card[data-file-id="${id}"]`);
                if (card && card.parentElement) card.parentElement.removeChild(card);
            });
            SELECTED_FILE_IDS.clear();
            const grid = document.querySelector('.files-grid');
            if (!grid || grid.children.length === 0) {
                window.location.reload();
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            alert('Failed to delete files.');
        });
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

