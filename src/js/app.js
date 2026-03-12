/**
 * SESEC Partner Map Application
 * Version: 1.0
 * Architecture designed for future dynamic data integration
 */

(function() {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        dataSource: 'data/partners.csv',
        version: '1.0',
        lastUpdated: 'March 2026'
    };

    // ============================================
    // Application State
    // ============================================
    const state = {
        partners: [],
        filteredPartners: [],
        currentView: 'grid',
        filters: {
            search: '',
            cat1: '',
            cat2: '',
            cat3: '',
            cat4: '',
            geography: '',
            theme: ''
        },
        map: null,
        markers: []
    };

    // ============================================
    // Data Loading & Parsing
    // ============================================
    async function loadData() {
        try {
            showLoading(true);
            const response = await fetch(CONFIG.dataSource);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const csvText = await response.text();
            state.partners = parseCSV(csvText);
            state.filteredPartners = [...state.partners];

            populateFilterDropdowns();
            renderPartners();
            updateStats();
            showLoading(false);

            console.log(`✅ Loaded ${state.partners.length} partners successfully`);
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Failed to load partner data. Please refresh the page or contact support.');
            showLoading(false);
        }
    }

    function parseCSV(text) {
        const lines = text.split('\n');
        const headers = parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = parseCSVLine(lines[i]);
            const partner = {};

            headers.forEach((header, index) => {
                partner[header] = values[index] || '';
            });

            // Data validation
            if (partner['Organization Name']) {
                data.push(partner);
            }
        }

        return data;
    }

    function parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    }

    // ============================================
    // Filter Population
    // ============================================
    function populateFilterDropdowns() {
        populateGeographyFilter();
        populateThemeFilter();
    }

    function populateGeographyFilter() {
        const geoAreas = new Set();
        state.partners.forEach(p => {
            if (p['Geographic Area']) {
                // Consolidate geographic areas
                let normalized = normalizeGeography(p['Geographic Area']);
                geoAreas.add(normalized);
            }
        });

        const select = document.getElementById('filterGeo');
        Array.from(geoAreas).sort().forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            select.appendChild(option);
        });
    }

    function normalizeGeography(area) {
        // Consolidate duplicate/similar geographic areas
        const consolidated = {
            // Seattle - All general Seattle references
            'Seattle, Washington': 'Seattle',
            'Seattle, WA': 'Seattle',
            'Seattle, Washington (Woodland Park location)': 'Seattle',
            'Seattle area (inferred)': 'Seattle',
            'Seattle area (broader coverage)': 'Seattle',
            'Citywide Seattle': 'Seattle',
            'Citywide Seattle (city limits only)': 'Seattle',
            'Seattle with 27 branch locations citywide': 'Seattle',
            'Seattle, Washington (broader city-wide focus with community partners throughout the area)': 'Seattle',
            'Seattle and surrounding regions': 'Seattle',
            'Seattle-based with broader regional scope': 'Seattle',
            'Seattle area and beyond': 'Seattle',
            'Seattle-based': 'Seattle',
            'Seattle and Tacoma': 'Seattle',

            // Tacoma
            'Tacoma': 'Tacoma',

            // Seattle - District-wide (kept separate as it's specifically for Seattle Public Schools)
            'Seattle (district-wide); some King County partnerships': 'Seattle Public Schools',
            'Seattle Public Schools district-wide': 'Seattle Public Schools',

            // North Seattle & Neighborhoods
            'Seattle, Washington - North Seattle region': 'North Seattle',
            'Seattle, Greenwood neighborhood': 'Greenwood Neighborhood',

            // South Seattle & Rainier Beach
            'Seattle, Washington, with focus on South Seattle (Rainier Valley area)': 'South Seattle',
            'South Seattle, Columbia City neighborhood': 'South Seattle',
            'Seattle, WA 98118': 'Rainier Valley',
            'Rainier Beach area of Southeast Seattle': 'Rainier Beach',
            'Rainier Beach neighborhood in South Seattle': 'Rainier Beach',
            'Rainier Beach neighborhood, South Seattle, South King County': 'Rainier Beach',

            // King County
            'Seattle (Beacon Hill), Federal Way, and King County; expanding early learning centers to Roosevelt, Columbia City, International District, and Northgate (2026)': 'King County',
            'Seattle/King County area': 'King County',
            'Seattle King County region': 'King County',
            'Seattle-King County region': 'King County',
            'Seattle region (King County)': 'King County',
            'Seattle region and King County area': 'King County',
            'Greater King County region (Renton, Tukwila, Lake Washington, Issaquah, Seattle)': 'King County',
            'King County with primary focus on South King County; serves multiple school districts across the region': 'King County',
            'South Seattle and greater King County': 'King County',
            'King County, Seattle, and North Pierce County': 'King County',

            // Broader regions
            'Puget Sound region': 'Puget Sound Region',
            'Pacific Northwest (Washington state focus)': 'Pacific Northwest',
            'Pacific Northwest and nationally': 'Pacific Northwest',
            'Washington, Oregon, and Idaho (22 counties); Northwest regional office in Seattle': 'Pacific Northwest',

            // Washington State
            'Statewide Washington coverage with South Seattle programs referenced': 'Washington State',
            'Statewide Washington': 'Washington State',
            'Washington State (statewide focus)': 'Washington State',
            'Washington State (statewide)': 'Washington State',
            'Washington State': 'Washington State',

            // National
            'National (United States) - operates across federal and state levels including Washington state': 'National'
        };

        // Catch any variations not explicitly mapped
        const lowerArea = area.toLowerCase();
        if (lowerArea.includes('washington state') || lowerArea === 'statewide') {
            return 'Washington State';
        }

        return consolidated[area] || area;
    }

    function populateThemeFilter() {
        const themes = new Set();
        state.partners.forEach(p => {
            if (p['Additional Themes']) {
                p['Additional Themes'].split(',').forEach(theme => {
                    const trimmed = theme.trim();
                    if (trimmed) {
                        const normalized = normalizeTheme(trimmed);
                        themes.add(normalized);
                    }
                });
            }
        });

        const themeGroups = groupThemes(Array.from(themes));
        const select = document.getElementById('filterTheme');

        // Store category mappings for later use
        window.themeCategoryMap = {};

        Object.keys(themeGroups).sort().forEach(groupName => {
            // Add category header as a selectable option (instead of optgroup)
            const categoryKey = `__ALL_${groupName}__`;
            const categoryOption = document.createElement('option');
            categoryOption.value = categoryKey;
            categoryOption.textContent = groupName;
            categoryOption.style.fontWeight = 'bold';
            categoryOption.style.backgroundColor = '#f0f0f0';
            categoryOption.setAttribute('data-category-header', groupName);
            select.appendChild(categoryOption);

            // Store the themes in this category
            window.themeCategoryMap[categoryKey] = themeGroups[groupName];

            // Add individual theme options
            themeGroups[groupName].sort().forEach(theme => {
                const option = document.createElement('option');
                option.value = theme;
                option.textContent = '  ' + theme; // Indent to show hierarchy
                option.setAttribute('data-category', groupName);
                select.appendChild(option);
            });
        });
    }

    function normalizeTheme(theme) {
        const lower = theme.toLowerCase();

        // Consolidation rules
        const consolidations = {
            // Basic Needs consolidation
            'basic needs': 'Basic Needs',
            'basic needs support': 'Basic Needs',
            'emergency assistance': 'Emergency Assistance',

            // Food Security consolidation
            'food security': 'Food Security',
            'food security (distributed $5 million in food and rental assistance during covid-19)': 'Food Security',
            'food security (food bank - 312)': 'Food Security',
            'food security and access (primary focus)': 'Food Security',
            'equitable food access': 'Food Security',
            'food equity fund': 'Food Security',
            'food justice': 'Food Security',

            // Keep these separate as they're distinct concepts
            'food science': 'Food Science & Education',
            'coast salish traditional foodways': 'Cultural Food Programs',

            // Health consolidation
            'behavioral health': 'Behavioral Health',
            'mental health': 'Mental Health',
            'health and wellness': 'Health & Wellness',
            'violence prevention': 'Violence Prevention',

            // Housing consolidation
            'housing': 'Housing',
            'housing support': 'Housing',
            'eviction prevention': 'Eviction Prevention',

            // Immigration consolidation
            'immigration support': 'Immigration Services',
            'immigration': 'Immigration Services',
            'citizenship and immigration services': 'Immigration Services',
            'refugee services': 'Refugee Services',
            'translation services': 'Translation Services',

            // Youth & Education consolidation
            'youth development': 'Youth Development',
            'youth programs': 'Youth Development',
            'literacy': 'Literacy',
            'stem education': 'STEM Education',
            'stem': 'STEM Education',
            'college access': 'College Access',
            'academic support': 'Academic Support',

            // Workforce consolidation
            'workforce development': 'Workforce Development',
            'job training': 'Workforce Development',
            'economic development': 'Economic Development',

            // Community consolidation
            'civic engagement': 'Civic Engagement',
            'community organizing': 'Community Organizing',
            'advocacy': 'Advocacy',
            'policy advocacy': 'Policy Advocacy',
            'social justice': 'Social Justice',
            'equity': 'Equity',

            // Cultural consolidation
            'cultural programming': 'Cultural Programs',
            'cultural services': 'Cultural Programs',

            // Leadership consolidation
            'leadership development': 'Leadership Development',
            'professional development': 'Professional Development',
            'capacity building': 'Capacity Building',

            // Environment
            'environmental education': 'Environmental Education',
            'sustainability': 'Sustainability'
        };

        // Check for exact match (case-insensitive)
        if (consolidations[lower]) {
            return consolidations[lower];
        }

        // Apply title case to original theme
        return toTitleCase(theme);
    }

    function toTitleCase(str) {
        // Words that should remain lowercase (articles, conjunctions, prepositions)
        const lowerCaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'with'];

        return str.toLowerCase().split(' ').map((word, index) => {
            // Always capitalize first word
            if (index === 0 || !lowerCaseWords.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        }).join(' ');
    }

    function groupThemes(themes) {
        const groups = {
            'Youth & Education': [],
            'Basic Needs & Services': [],
            'Immigration & Cultural': [],
            'Community & Advocacy': [],
            'Workforce & Economic': [],
            'Health & Wellness': [],
            'Housing & Facilities': [],
            'Leadership & Systems': [],
            'Environment & Sustainability': [],
            'Other': []
        };

        themes.forEach(theme => {
            const lower = theme.toLowerCase();

            // Youth & Education
            if (lower.includes('youth') || lower.includes('literacy') || lower.includes('education') ||
                lower.includes('tutoring') || lower.includes('academic') || lower.includes('stem') ||
                lower.includes('college') || lower.includes('learning') || lower.includes('school')) {
                groups['Youth & Education'].push(theme);
            }
            // Basic Needs & Services
            else if (lower.includes('food') || lower.includes('basic needs') || lower.includes('emergency')) {
                groups['Basic Needs & Services'].push(theme);
            }
            // Immigration & Cultural
            else if (lower.includes('immigrant') || lower.includes('refugee') || lower.includes('cultural') ||
                     lower.includes('translation') || lower.includes('citizenship') || lower.includes('immigration')) {
                groups['Immigration & Cultural'].push(theme);
            }
            // Community & Advocacy
            else if (lower.includes('civic') || lower.includes('advocacy') || lower.includes('policy') ||
                     lower.includes('organizing') || lower.includes('community') || lower.includes('engagement') ||
                     lower.includes('social justice') || lower.includes('equity')) {
                groups['Community & Advocacy'].push(theme);
            }
            // Workforce & Economic
            else if (lower.includes('workforce') || lower.includes('job') || lower.includes('economic') ||
                     lower.includes('employment') || lower.includes('career')) {
                groups['Workforce & Economic'].push(theme);
            }
            // Health & Wellness
            else if (lower.includes('health') || lower.includes('mental') || lower.includes('behavioral') ||
                     lower.includes('wellness') || lower.includes('medical') || lower.includes('violence')) {
                groups['Health & Wellness'].push(theme);
            }
            // Housing & Facilities
            else if (lower.includes('housing') || lower.includes('shelter') || lower.includes('eviction') ||
                     lower.includes('facility')) {
                groups['Housing & Facilities'].push(theme);
            }
            // Leadership & Systems
            else if (lower.includes('leadership') || lower.includes('professional development') ||
                     lower.includes('capacity') || lower.includes('research') || lower.includes('systems')) {
                groups['Leadership & Systems'].push(theme);
            }
            // Environment & Sustainability
            else if (lower.includes('environment') || lower.includes('sustainability') || lower.includes('agriculture') ||
                     lower.includes('conservation')) {
                groups['Environment & Sustainability'].push(theme);
            }
            // Other
            else {
                groups['Other'].push(theme);
            }
        });

        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) {
                delete groups[key];
            }
        });

        return groups;
    }

    // ============================================
    // Filtering Logic
    // ============================================
    function applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const cat1 = document.getElementById('filterCat1').value;
        const cat2 = document.getElementById('filterCat2').value;
        const cat3 = document.getElementById('filterCat3').value;
        const cat4 = document.getElementById('filterCat4').value;

        // Get selected values from multi-select dropdowns
        const geoSelect = document.getElementById('filterGeo');
        const geoOptions = Array.from(geoSelect.selectedOptions).map(opt => opt.value).filter(v => v !== '');

        const themeSelect = document.getElementById('filterTheme');
        const themeOptions = Array.from(themeSelect.selectedOptions).map(opt => opt.value).filter(v => v !== '');

        state.filteredPartners = state.partners.filter(partner => {
            // Search filter
            if (searchTerm) {
                const searchFields = [
                    partner['Organization Name'],
                    partner['Mission/Summary'],
                    partner['Target Communities'],
                    partner['Additional Themes'],
                    partner['Geographic Area']
                ].join(' ').toLowerCase();

                if (!searchFields.includes(searchTerm)) return false;
            }

            // Category filters
            if (cat1 && !matchesCategory(partner['Category 1: Integrated Student Support'], cat1)) return false;
            if (cat2 && !matchesCategory(partner['Category 2: Expanded Learning & Cultural Relevance'], cat2)) return false;
            if (cat3 && !matchesCategory(partner['Category 3: Family & Community Engagement'], cat3)) return false;
            if (cat4 && !matchesCategory(partner['Category 4: Collaborative Leadership'], cat4)) return false;

            // Geography filter (multi-select)
            if (geoOptions.length > 0) {
                const partnerGeo = normalizeGeography(partner['Geographic Area']);
                if (!geoOptions.includes(partnerGeo)) return false;
            }

            // Theme filter (multi-select)
            if (themeOptions.length > 0) {
                const partnerThemes = partner['Additional Themes'].split(',').map(t => normalizeTheme(t.trim()));
                const hasMatch = themeOptions.some(selectedTheme => partnerThemes.includes(selectedTheme));
                if (!hasMatch) return false;
            }

            return true;
        });

        renderPartners();
        updateActiveFilters();
        updateStats();

        // Update map if in map view
        if (state.currentView === 'map' && state.map) {
            updateMapMarkers();
        }
    }

    function matchesCategory(value, filter) {
        if (filter === 'Yes') return value === 'Yes' || value === 'Partial';
        return value === filter;
    }

    // ============================================
    // Rendering
    // ============================================
    function renderPartners() {
        const grid = document.getElementById('partnersGrid');
        const list = document.getElementById('partnersList');
        const noResults = document.getElementById('noResults');

        grid.innerHTML = '';
        list.innerHTML = '';

        if (state.filteredPartners.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        state.filteredPartners.forEach(partner => {
            grid.appendChild(createPartnerCard(partner));
            list.appendChild(createPartnerListItem(partner));
        });
    }

    function createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.onclick = () => showPartnerDetails(partner);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View details for ${partner['Organization Name']}`);

        const categories = getCategoryBadges(partner);
        const mission = partner['Mission/Summary'].replace(/^"(.*)"$/, '$1');

        card.innerHTML = `
            <div class="partner-name">${escapeHtml(partner['Organization Name'])}</div>
            <div class="partner-mission">${escapeHtml(mission)}</div>
            <div class="categories">${categories}</div>
            <div class="partner-meta">
                ${partner['Geographic Area'] ? `
                    <div class="meta-item">
                        <span class="meta-icon" aria-label="Location">📍</span>
                        <span>${escapeHtml(partner['Geographic Area'])}</span>
                    </div>
                ` : ''}
                ${partner['Target Communities'] ? `
                    <div class="meta-item">
                        <span class="meta-icon" aria-label="Communities served">👥</span>
                        <span>${escapeHtml(partner['Target Communities'].substring(0, 100))}...</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Keyboard support
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPartnerDetails(partner);
            }
        });

        return card;
    }

    function createPartnerListItem(partner) {
        const item = document.createElement('div');
        item.className = 'partner-list-item';
        item.onclick = () => showPartnerDetails(partner);
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');

        const mission = partner['Mission/Summary'].replace(/^"(.*)"$/, '$1');

        item.innerHTML = `
            <div class="partner-name" style="margin-bottom: 10px;">
                ${escapeHtml(partner['Organization Name'])}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <div style="color: var(--text-muted); font-size: 0.95rem;">
                        ${escapeHtml(mission.substring(0, 200))}...
                    </div>
                </div>
                <div style="color: var(--text-muted); font-size: 0.9rem; min-width: 200px;">
                    📍 ${escapeHtml(partner['Geographic Area'])}<br>
                    📧 ${escapeHtml(partner['Email'] || 'N/A')}
                </div>
            </div>
        `;

        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showPartnerDetails(partner);
            }
        });

        return item;
    }

    function getCategoryBadges(partner) {
        const badges = [];

        if (partner['Category 1: Integrated Student Support'] === 'Yes') {
            badges.push('<span class="category-badge cat1">Integrated Support</span>');
        }
        if (partner['Category 2: Expanded Learning & Cultural Relevance'] === 'Yes' ||
            partner['Category 2: Expanded Learning & Cultural Relevance'] === 'Partial') {
            badges.push('<span class="category-badge cat2">Expanded Learning</span>');
        }
        if (partner['Category 3: Family & Community Engagement'] === 'Yes') {
            badges.push('<span class="category-badge cat3">Family & Community</span>');
        }
        if (partner['Category 4: Collaborative Leadership'] === 'Yes') {
            badges.push('<span class="category-badge cat4">Collaborative Leadership</span>');
        }

        return badges.join('');
    }

    // ============================================
    // Partner Details Modal
    // ============================================
    function showPartnerDetails(partner) {
        const modal = document.getElementById('partnerModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        title.textContent = partner['Organization Name'];

        const mission = partner['Mission/Summary'].replace(/^"(.*)"$/, '$1');
        const themes = partner['Additional Themes'] ?
            [...new Set(partner['Additional Themes'].split(',').map(t => normalizeTheme(t.trim())))]
                .map(t => `<span class="theme-tag">${escapeHtml(t)}</span>`)
                .join('') :
            '<span style="color: var(--text-muted);">None specified</span>';

        body.innerHTML = `
            <div class="detail-section">
                <h3>Mission & Overview</h3>
                <p style="font-size: 1rem; line-height: 1.8; color: var(--text);">
                    ${escapeHtml(mission)}
                </p>
            </div>

            <div class="detail-section">
                <h3>Service Categories</h3>
                <div class="detail-grid">
                    ${createDetailItem('Integrated Student Support', partner['Category 1: Integrated Student Support'])}
                    ${createDetailItem('Expanded Learning & Cultural Relevance', partner['Category 2: Expanded Learning & Cultural Relevance'])}
                    ${createDetailItem('Family & Community Engagement', partner['Category 3: Family & Community Engagement'])}
                    ${createDetailItem('Collaborative Leadership & Practices', partner['Category 4: Collaborative Leadership'])}
                </div>
            </div>

            <div class="detail-section">
                <h3>Communities Served</h3>
                ${createDetailItem('Target Communities', partner['Target Communities'] || 'Not specified')}
                <div style="margin-top: 10px;">
                    ${createDetailItem('Geographic Area', partner['Geographic Area'] || 'Not specified')}
                </div>
            </div>

            <div class="detail-section">
                <h3>Contact Information</h3>
                <div class="contact-info">
                    ${partner['URL'] ? `
                        <div class="contact-item">
                            🌐 <a href="${escapeHtml(partner['URL'])}" target="_blank" rel="noopener noreferrer">
                                ${escapeHtml(partner['URL'])}
                            </a>
                        </div>
                    ` : ''}
                    ${partner['Email'] ? `
                        <div class="contact-item">
                            📧 <a href="mailto:${escapeHtml(partner['Email'])}">
                                ${escapeHtml(partner['Email'])}
                            </a>
                        </div>
                    ` : ''}
                    ${partner['Phone'] ? `
                        <div class="contact-item">
                            📞 <a href="tel:${escapeHtml(partner['Phone'])}">
                                ${escapeHtml(partner['Phone'])}
                            </a>
                        </div>
                    ` : ''}
                    ${partner['Address'] ? `
                        <div class="contact-item">
                            📍 ${escapeHtml(partner['Address'])}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="detail-section">
                <h3>Additional Focus Areas & Themes</h3>
                <div class="themes-list">${themes}</div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        setTimeout(() => {
            document.querySelector('.modal-close').focus();
        }, 100);
    }

    function createDetailItem(label, value) {
        return `
            <div class="detail-item">
                <div class="detail-label">${escapeHtml(label)}</div>
                <div class="detail-value">${escapeHtml(value || 'N/A')}</div>
            </div>
        `;
    }

    function closeModal() {
        const modal = document.getElementById('partnerModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // ============================================
    // View Switching
    // ============================================
    function switchView(view) {
        state.currentView = view;
        const grid = document.getElementById('partnersGrid');
        const list = document.getElementById('partnersList');
        const map = document.getElementById('partnersMap');
        const buttons = document.querySelectorAll('.view-btn');

        buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        // Remove active class from all views
        grid.classList.remove('active');
        list.classList.remove('active');
        map.classList.remove('active');

        if (view === 'grid') {
            grid.classList.add('active');
            buttons[0].classList.add('active');
            buttons[0].setAttribute('aria-selected', 'true');
        } else if (view === 'list') {
            list.classList.add('active');
            buttons[1].classList.add('active');
            buttons[1].setAttribute('aria-selected', 'true');
        } else if (view === 'map') {
            map.classList.add('active');
            buttons[2].classList.add('active');
            buttons[2].setAttribute('aria-selected', 'true');
            initializeMap();
            updateMapMarkers();
        }
    }

    // ============================================
    // Active Filters Display
    // ============================================
    function updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        container.innerHTML = '';

        const filters = [
            { id: 'filterCat1', label: 'Category 1', multi: false },
            { id: 'filterCat2', label: 'Category 2', multi: false },
            { id: 'filterCat3', label: 'Category 3', multi: false },
            { id: 'filterCat4', label: 'Category 4', multi: false },
            { id: 'filterGeo', label: 'Area', multi: true },
            { id: 'filterTheme', label: 'Theme', multi: true }
        ];

        let hasFilters = false;

        filters.forEach(filter => {
            const select = document.getElementById(filter.id);

            if (filter.multi) {
                // Handle multi-select dropdowns
                const selectedOptions = Array.from(select.selectedOptions).filter(opt => opt.value !== '');
                selectedOptions.forEach(option => {
                    hasFilters = true;
                    const tag = document.createElement('div');
                    tag.className = 'filter-tag';
                    tag.innerHTML = `
                        ${escapeHtml(filter.label)}: ${escapeHtml(option.text)}
                        <button onclick="window.partnerMap.clearFilterOption('${filter.id}', '${escapeHtml(option.value)}')" aria-label="Remove ${filter.label} filter">×</button>
                    `;
                    container.appendChild(tag);
                });
            } else {
                // Handle single-select dropdowns
                if (select.value) {
                    hasFilters = true;
                    const tag = document.createElement('div');
                    tag.className = 'filter-tag';
                    tag.innerHTML = `
                        ${escapeHtml(filter.label)}: ${escapeHtml(select.options[select.selectedIndex].text)}
                        <button onclick="window.partnerMap.clearFilter('${filter.id}')" aria-label="Remove ${filter.label} filter">×</button>
                    `;
                    container.appendChild(tag);
                }
            }
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput.value) {
            hasFilters = true;
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            tag.innerHTML = `
                Search: "${escapeHtml(searchInput.value)}"
                <button onclick="window.partnerMap.clearSearch()" aria-label="Clear search">×</button>
            `;
            container.appendChild(tag);
        }

        if (hasFilters) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'clear-filters';
            clearBtn.textContent = 'Clear All';
            clearBtn.onclick = clearAllFilters;
            clearBtn.setAttribute('aria-label', 'Clear all filters');
            container.appendChild(clearBtn);
        }
    }

    function clearFilter(filterId) {
        const select = document.getElementById(filterId);
        if (select.multiple) {
            Array.from(select.options).forEach(opt => opt.selected = false);
        } else {
            select.value = '';
        }
        applyFilters();
    }

    function clearFilterOption(filterId, optionValue) {
        const select = document.getElementById(filterId);
        Array.from(select.options).forEach(opt => {
            if (opt.value === optionValue) {
                opt.selected = false;
            }
        });
        applyFilters();
    }

    function clearSearch() {
        document.getElementById('searchInput').value = '';
        applyFilters();
    }

    function clearAllFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterCat1').value = '';
        document.getElementById('filterCat2').value = '';
        document.getElementById('filterCat3').value = '';
        document.getElementById('filterCat4').value = '';

        // Clear multi-select dropdowns
        const geoSelect = document.getElementById('filterGeo');
        const themeSelect = document.getElementById('filterTheme');
        Array.from(geoSelect.options).forEach(opt => opt.selected = false);
        Array.from(themeSelect.options).forEach(opt => opt.selected = false);

        applyFilters();
    }

    // ============================================
    // Statistics Update
    // ============================================
    function updateStats() {
        document.getElementById('totalPartners').textContent = state.partners.length;
        document.getElementById('filteredCount').textContent = state.filteredPartners.length;
        document.getElementById('resultsCount').textContent =
            `Showing ${state.filteredPartners.length} partner${state.filteredPartners.length !== 1 ? 's' : ''}`;
    }

    // ============================================
    // UI State Management
    // ============================================
    function showLoading(show) {
        const loading = document.getElementById('loadingState');
        loading.style.display = show ? 'block' : 'none';
    }

    function showError(message) {
        const noResults = document.getElementById('noResults');
        noResults.innerHTML = `
            <h3>⚠️ Error Loading Data</h3>
            <p>${escapeHtml(message)}</p>
        `;
        noResults.style.display = 'block';
    }

    // ============================================
    // Utilities
    // ============================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // Event Listeners
    // ============================================
    function initEventListeners() {
        // Search with debounce
        document.getElementById('searchInput').addEventListener(
            'input',
            debounce(applyFilters, 300)
        );

        // Filter dropdowns
        ['filterCat1', 'filterCat2', 'filterCat3', 'filterCat4', 'filterGeo']
            .forEach(id => {
                document.getElementById(id).addEventListener('change', applyFilters);
            });

        // Special handling for theme filter (category selection)
        const themeSelect = document.getElementById('filterTheme');
        themeSelect.addEventListener('change', handleThemeSelection);

        // Modal close on outside click
        document.getElementById('partnerModal').addEventListener('click', (e) => {
            if (e.target.id === 'partnerModal') {
                closeModal();
            }
        });

        // Modal close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    function handleThemeSelection() {
        const themeSelect = document.getElementById('filterTheme');
        const selectedOptions = Array.from(themeSelect.selectedOptions);

        // Check if any category header options were just selected
        selectedOptions.forEach(option => {
            if (option.value.startsWith('__ALL_')) {
                const categoryKey = option.value;
                const themesInCategory = window.themeCategoryMap[categoryKey];

                if (themesInCategory) {
                    // Check if all themes in this category are already selected
                    const categoryThemeOptions = Array.from(themeSelect.options).filter(opt =>
                        themesInCategory.includes(opt.value)
                    );
                    const allSelected = categoryThemeOptions.every(opt => opt.selected);

                    if (allSelected) {
                        // If all are selected, deselect all
                        categoryThemeOptions.forEach(opt => {
                            opt.selected = false;
                        });
                    } else {
                        // If not all are selected, select all
                        categoryThemeOptions.forEach(opt => {
                            opt.selected = true;
                        });
                    }
                }

                // Deselect the category header itself (it's just a trigger)
                option.selected = false;
            }
        });

        applyFilters();
    }

    // ============================================
    // Map View Functions
    // ============================================
    function initializeMap() {
        if (state.map) return; // Already initialized

        const container = document.getElementById('mapContainer');
        if (!container) return;

        // Initialize map centered on Seattle
        state.map = L.map('mapContainer').setView([47.6062, -122.3321], 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(state.map);

        // Fix map size issues
        setTimeout(() => {
            state.map.invalidateSize();
        }, 100);
    }

    function updateMapMarkers() {
        if (!state.map) return;

        // Clear existing markers
        state.markers.forEach(marker => marker.remove());
        state.markers = [];

        // Add markers for filtered partners
        state.filteredPartners.forEach(partner => {
            const coords = geocodeAddress(partner['Address']);
            if (coords) {
                const marker = L.marker(coords)
                    .addTo(state.map)
                    .bindPopup(createMarkerPopup(partner));

                marker.on('click', () => {
                    showPartnerDetails(partner);
                });

                state.markers.push(marker);
            }
        });

        // Fit map to show all markers
        if (state.markers.length > 0) {
            const group = L.featureGroup(state.markers);
            state.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    function geocodeAddress(address) {
        if (!address || address === 'Not available on website' || address === 'Information not available on website') {
            return null;
        }

        // Simple geocoding based on known Seattle addresses
        // This is a hardcoded mapping - in production, you'd use a geocoding API
        const knownLocations = {
            '509 Olive Way, Suite 500, Seattle, WA 98101-2556': [47.6142, -122.3356],
            '3639 Martin Luther King Jr. Way S, Seattle, WA 98144': [47.5797, -122.2908],
            '2103 S. Atlantic St., Seattle, WA 98144': [47.5794, -122.2915],
            '3715 S Hudson St, Suite #111 (Lower Level), Seattle, WA 98118': [47.5345, -122.2698],
            '8323 Rainier Ave S, Suite A, Seattle, WA 98118': [47.5235, -122.2695],
            '7728 Rainier Avenue South, Seattle, WA 98118': [47.5207, -122.2692],
            '611 S Lane St, Seattle, WA 98104': [47.5970, -122.3232],
            '4000 Aurora Ave N Suite 123, Seattle, WA 98103': [47.6515, -122.3472],
            '600 4th Avenue, 4th Floor, Seattle, WA 98104': [47.6042, -122.3296],
            '810 3rd Avenue, Suite 750, Seattle, WA 98104-1627': [47.6062, -122.3321],
            '700 5th Ave, Suite 1700, Seattle, WA 98104': [47.6059, -122.3301],
            '1200 12th Ave S, Suite 710, Mailbox #14, Seattle, WA 98144': [47.5970, -122.3176],
            '3407 NE 2nd St, Renton, WA 98056': [47.4857, -122.1928],
            '21428 44th Avenue, Seattle, WA': [47.7249, -122.2966],
            '2524 16th Ave S, Seattle, WA 98144': [47.5786, -122.3120],
            '1200 12th Ave S, Suite 830, Seattle, WA 98144': [47.5970, -122.3176],
            '8815 Seward Park Ave. S, Seattle, WA 98118': [47.5214, -122.2571],
            '2100 24th Ave S, Suite 360, Seattle, WA 98144-4646': [47.5794, -122.2976],
            '3715 S Hudson St, Suite 103, Seattle, WA 98118': [47.5345, -122.2698],
            '4008 Martin Luther King, Jr. Way South, Seattle, WA 98108': [47.5638, -122.2908],
            '1500 Harvard Avenue, Seattle, WA 98122': [47.6172, -122.3211],
            '2445 3rd Ave. S, Seattle, WA 98134': [47.5814, -122.3302],
            '3820 S Ferdinand St #201A, Seattle, WA 98118': [47.5341, -122.2683],
            '3250 Airport Way S Suite 742, Seattle, WA 98134': [47.5759, -122.3154],
            '3722 S Hudson St, Seattle, WA 98118': [47.5345, -122.2698],
            '1000 Fourth Ave., Seattle, WA 98104-1109': [47.6066, -122.3343],
            '5623 Rainier Ave S, Seattle, WA 98118': [47.5466, -122.2695],
            '6930 Martin Luther King Jr. Way S, Seattle, WA 98118': [47.5392, -122.2908],
            '1225 South Weller Street, Suite 510, Seattle, WA 98144': [47.5969, -122.3176],
            '9013 Martin Luther King Jr Way S, Seattle, WA 98118': [47.5194, -122.2908]
        };

        return knownLocations[address] || null;
    }

    function createMarkerPopup(partner) {
        const mission = partner['Mission/Summary'].replace(/^"(.*)"$/, '$1').substring(0, 150) + '...';
        return `
            <div style="max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: var(--primary); font-size: 1rem;">
                    ${escapeHtml(partner['Organization Name'])}
                </h3>
                <p style="margin: 5px 0; font-size: 0.85rem;">
                    <strong>Address:</strong><br>
                    ${escapeHtml(partner['Address'] || 'Not available')}
                </p>
                <p style="margin: 5px 0; font-size: 0.85rem;">
                    ${escapeHtml(mission)}
                </p>
                <p style="margin: 8px 0 0 0;">
                    <a href="#" onclick="event.preventDefault();" style="color: var(--secondary); font-size: 0.85rem;">
                        Click marker for details
                    </a>
                </p>
            </div>
        `;
    }

    // ============================================
    // Public API (for future expansion)
    // ============================================
    window.partnerMap = {
        switchView,
        closeModal,
        clearFilter,
        clearFilterOption,
        clearSearch,
        getState: () => ({ ...state }),
        refresh: loadData,
        version: CONFIG.version
    };

    // ============================================
    // Initialization
    // ============================================
    function init() {
        console.log(`🚀 SESEC Partner Map v${CONFIG.version} initializing...`);
        initEventListeners();
        loadData();
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
