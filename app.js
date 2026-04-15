// ===================================
// PUGLIA 2026 - App JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMap();
});

// ===================================
// NAVBAR
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            links.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navItems.forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// ===================================
// MAP DATA
// ===================================
const mapData = {
    campsite: [
        {
            name: "Centro Vacanze Summerland",
            lat: 43.7180, lng: 13.2140,
            desc: "Senigallia (Marche) - Tappa intermedia andata. 3 piscine, vicino alla spiaggia, animazione.",
            zone: "Tappa intermedia"
        },
        {
            name: "Molinella Vacanze",
            lat: 41.8690, lng: 16.1920,
            desc: "Vieste (Gargano) - Direttamente sulla spiaggia, campeggio storico dal 1975, area camper service.",
            zone: "Gargano"
        },
        {
            name: "Campeggio Lamaforca",
            lat: 40.7080, lng: 17.6600,
            desc: "Carovigno - Immerso tra gli ulivi, vicino Torre Guaceto. Base strategica per Ostuni e Polignano.",
            zone: "Ostuni"
        },
        {
            name: "Baia di Gallipoli Camping Village",
            lat: 40.0300, lng: 17.9600,
            desc: "Gallipoli - Parco Naturale di Punta Pizzo, animazione, piscina, accesso spiaggia.",
            zone: "Salento"
        },
        {
            name: "Camping delle Rose",
            lat: 42.8900, lng: 13.9200,
            desc: "Martinsicuro (TE) - Tappa intermedia ritorno. Spiaggia sabbiosa, fondale basso.",
            zone: "Tappa intermedia"
        }
    ],
    beach: [
        {
            name: "Baia delle Zagare",
            lat: 41.8328, lng: 16.1842,
            desc: "Due faraglioni spettacolari, acqua turchese, falesie bianche. La piu scenografica del Gargano.",
            zone: "Gargano"
        },
        {
            name: "Spiaggia di Vignanotica",
            lat: 41.8147, lng: 16.1890,
            desc: "Spiaggia selvaggia sotto falesie di 30m. Sentiero nel bosco di 20 min.",
            zone: "Gargano"
        },
        {
            name: "Spiaggia di Scialmarino",
            lat: 41.8970, lng: 16.1640,
            desc: "Lunga spiaggia sabbiosa raggiungibile in bici da Vieste (~3 km).",
            zone: "Gargano"
        },
        {
            name: "Pugnochiuso",
            lat: 41.8600, lng: 16.1890,
            desc: "Baia riparata, acqua turchese, pineta. Fondale basso e sabbioso.",
            zone: "Gargano"
        },
        {
            name: "Torre Guaceto",
            lat: 40.7160, lng: 17.7920,
            desc: "Area marina protetta. Snorkeling eccezionale, Posidonia, stelle marine. Ciclabile 6 km.",
            zone: "Ostuni"
        },
        {
            name: "Pilone Beach",
            lat: 40.7365, lng: 17.7105,
            desc: "Spiaggia sabbiosa con dune naturali. Bandiera Blu, fondale basso.",
            zone: "Ostuni"
        },
        {
            name: "Lama Monachile",
            lat: 40.9942, lng: 17.2212,
            desc: "L'iconica spiaggetta col ponte. L'immagine piu fotografata di Puglia.",
            zone: "Polignano"
        },
        {
            name: "Cala Porta Vecchia",
            lat: 40.9503, lng: 17.3040,
            desc: "Spiaggia dentro le mura di Monopoli. Bagno ai piedi della citta medievale.",
            zone: "Monopoli"
        },
        {
            name: "Porto Ghiacciolo",
            lat: 40.9588, lng: 17.3150,
            desc: "Acqua gelida e trasparente da sorgenti sottomarine. Snorkeling straordinario.",
            zone: "Monopoli"
        },
        {
            name: "Baia dei Turchi",
            lat: 40.1760, lng: 18.4827,
            desc: "Sabbia bianca, acqua caraibica. Sentiero nel bosco. Acqua bassa per decine di metri.",
            zone: "Salento"
        },
        {
            name: "Torre dell'Orso",
            lat: 40.2724, lng: 18.4413,
            desc: "Baia a mezzaluna, faraglioni Due Sorelle (nuotabili ~50m). Bandiera Blu.",
            zone: "Salento"
        },
        {
            name: "Porto Selvaggio",
            lat: 40.1536, lng: 17.9750,
            desc: "Caletta rocciosa in pineta. Acqua gelida, snorkeling pazzesco. 15 min di sentiero.",
            zone: "Salento"
        },
        {
            name: "Punta Prosciutto",
            lat: 40.2863, lng: 17.7615,
            desc: "Acqua bassa per 100m, sabbia bianchissima. I Caraibi della Puglia.",
            zone: "Salento"
        },
        {
            name: "Spiaggia della Purita",
            lat: 40.0540, lng: 17.9905,
            desc: "Spiaggetta dentro le mura di Gallipoli. Tramonto imperdibile.",
            zone: "Salento"
        }
    ],
    culture: [
        {
            name: "Centro storico di Vieste",
            lat: 41.8822, lng: 16.1767,
            desc: "Vicoli bianchi, Cattedrale romanica, Castello Svevo, Pizzomunno.",
            zone: "Gargano"
        },
        {
            name: "Monte Sant'Angelo - Santuario UNESCO",
            lat: 41.7063, lng: 15.9561,
            desc: "Grotta-santuario di San Michele (490 d.C.), patrimonio UNESCO. Castello, Tomba di Rotari.",
            zone: "Gargano"
        },
        {
            name: "Peschici",
            lat: 41.9468, lng: 16.0143,
            desc: "Borgo medievale su rupe, trabucchi (antiche macchine da pesca). Vista mozzafiato.",
            zone: "Gargano"
        },
        {
            name: "Castel del Monte (UNESCO)",
            lat: 41.0845, lng: 16.2710,
            desc: "Castello ottagonale di Federico II. UNESCO. 10EUR/adulto, gratis under 18.",
            zone: "Trani/BAT"
        },
        {
            name: "Cattedrale di Trani",
            lat: 41.2803, lng: 16.4186,
            desc: "Capolavoro romanico costruito direttamente sul mare. Cripta di San Leucio.",
            zone: "Trani/BAT"
        },
        {
            name: "Colosso di Barletta",
            lat: 41.3188, lng: 16.2838,
            desc: "Statua bronzea di 5m del V sec. - la piu grande tardo-romana al mondo. Gratuito.",
            zone: "Trani/BAT"
        },
        {
            name: "Ostuni - La Citta Bianca",
            lat: 40.7295, lng: 17.5778,
            desc: "Labirinto di case bianche, Cattedrale con rosone di 7m, Museo con Delia (25.000 anni).",
            zone: "Ostuni"
        },
        {
            name: "Alberobello (UNESCO)",
            lat: 40.7846, lng: 17.2374,
            desc: "1.500 trulli unici al mondo. Rione Monti, Trullo Sovrano. Sembra Star Wars!",
            zone: "Valle d'Itria"
        },
        {
            name: "Locorotondo",
            lat: 40.7551, lng: 17.3268,
            desc: "Borgo circolare con vista sulla Valle d'Itria. Balconcini fioriti, atmosfera rilassata.",
            zone: "Valle d'Itria"
        },
        {
            name: "Cisternino",
            lat: 40.7403, lng: 17.4231,
            desc: "Borghi piu belli d'Italia. Fornelli pronti: scegli la carne, la grigliano davanti a te.",
            zone: "Valle d'Itria"
        },
        {
            name: "Grotte di Castellana",
            lat: 40.8735, lng: 17.1496,
            desc: "Grotte carsiche piu grandi d'Italia. Grotta Bianca = la piu bella del mondo. 20EUR/16EUR ridotto.",
            zone: "Valle d'Itria"
        },
        {
            name: "Polignano a Mare",
            lat: 40.9954, lng: 17.2204,
            desc: "Borgo su scogliere a strapiombo. Lama Monachile, statua di Modugno, poesie sulle scale.",
            zone: "Polignano"
        },
        {
            name: "Monopoli - Centro storico",
            lat: 40.9490, lng: 17.3030,
            desc: "Porto pittoresco con barche colorate, Cattedrale barocca, Castello Carlo V.",
            zone: "Monopoli"
        },
        {
            name: "Lecce - Basilica di Santa Croce",
            lat: 40.3537, lng: 18.1700,
            desc: "Capolavoro del barocco leccese. Facciata con putti, animali, frutta nella pietra dorata.",
            zone: "Salento"
        },
        {
            name: "Anfiteatro Romano di Lecce",
            lat: 40.3521, lng: 18.1716,
            desc: "II sec. d.C., scoperto nel 1901. In mezzo a Piazza Sant'Oronzo!",
            zone: "Salento"
        },
        {
            name: "Museo Faggiano - Lecce",
            lat: 40.3510, lng: 18.1720,
            desc: "Casa con 5 livelli archeologici sotto il pavimento: messapico, romano, medievale, templare. 5EUR.",
            zone: "Salento"
        },
        {
            name: "Otranto - Cattedrale e Mosaico",
            lat: 41.1456, lng: 18.4908,
            desc: "Mosaico di Pantaleone (1163): 600m2 con Albero della Vita, Re Artu, zodiaco. Martiri.",
            zone: "Salento"
        },
        {
            name: "Gallipoli - Citta Vecchia",
            lat: 40.0547, lng: 17.9910,
            desc: "Isola collegata da ponte. Cattedrale barocca, Frantoio Ipogeo sotterraneo, Castello.",
            zone: "Salento"
        },
        {
            name: "Santa Maria di Leuca",
            lat: 39.7933, lng: 18.3554,
            desc: "Il tacco dello stivale. Basilica De Finibus Terrae, faro, ville eclettiche.",
            zone: "Salento"
        }
    ],
    restaurant: [
        {
            name: "Osteria degli Archi",
            lat: 41.8830, lng: 16.1760,
            desc: "Vieste - Pesce e cucina garganica. Troccoli ai frutti di mare, tiella. 18-25EUR/persona.",
            zone: "Gargano"
        },
        {
            name: "Al Dragone",
            lat: 41.8825, lng: 16.1770,
            desc: "Vieste - Terrazza panoramica, pesce fresco. Spaghetti ai ricci. 20-30EUR/persona.",
            zone: "Gargano"
        },
        {
            name: "La Banchina",
            lat: 41.2810, lng: 16.4180,
            desc: "Trani - Sul porto con vista cattedrale. Pesce fresco. 20-28EUR/persona.",
            zone: "Trani"
        },
        {
            name: "Corteinfiore",
            lat: 41.2790, lng: 16.4170,
            desc: "Trani - Pugliese rivisitata. Burrata, orecchiette, dolci fatti in casa. 22-30EUR/persona.",
            zone: "Trani"
        },
        {
            name: "Fornello da Ricci",
            lat: 40.7410, lng: 17.4220,
            desc: "Cisternino - Fornello tipico! Bombette, salsiccia. Si fa la fila, non si prenota. 10-15EUR.",
            zone: "Ostuni/Valle d'Itria"
        },
        {
            name: "Osteria del Tempo Perso",
            lat: 40.7300, lng: 17.5770,
            desc: "Ostuni - In grotta/cantina. Orecchiette con braciole, fave e cicorie. 20-28EUR/persona.",
            zone: "Ostuni/Valle d'Itria"
        },
        {
            name: "Pescaria",
            lat: 40.9960, lng: 17.2190,
            desc: "Polignano - Street food di pesce gourmet. Panino polpo e patate. 8-15EUR/persona.",
            zone: "Polignano"
        },
        {
            name: "Alle Due Corti",
            lat: 40.3530, lng: 18.1710,
            desc: "Lecce - Cucina salentina autentica. Ciceri e tria, polpette al sugo. 18-25EUR/persona.",
            zone: "Salento"
        },
        {
            name: "L'Altro Baffo",
            lat: 40.1450, lng: 18.4900,
            desc: "Otranto - Pesce nel centro storico. Spaghetti ai ricci, frittura. 22-30EUR/persona.",
            zone: "Salento"
        },
        {
            name: "Trattoria La Puritate",
            lat: 40.0550, lng: 17.9915,
            desc: "Gallipoli - Storica trattoria. Scapece gallipolina, tubettini con cozze. 18-28EUR/persona.",
            zone: "Salento"
        }
    ],
    nature: [
        {
            name: "Foresta Umbra (UNESCO)",
            lat: 41.8052, lng: 15.9837,
            desc: "Foresta millenaria di faggi. Sentieri da 1 a 5 km. Daini, caprioli. 15-20C di refrigerio!",
            zone: "Gargano"
        },
        {
            name: "Grotte Marine di Vieste",
            lat: 41.8835, lng: 16.1795,
            desc: "Tour in barca 3h, ~10 grotte marine. 15-20EUR/adulto. Sosta bagno in baia.",
            zone: "Gargano"
        },
        {
            name: "Riserva Torre Guaceto",
            lat: 40.7160, lng: 17.7920,
            desc: "Area marina protetta + riserva terrestre. Ciclabile 6 km negli uliveti. Snorkeling top.",
            zone: "Ostuni"
        },
        {
            name: "Ciclovia Acquedotto Pugliese",
            lat: 40.7350, lng: 17.5200,
            desc: "Ostuni-Ceglie Messapica: 14 km tra ulivi millenari e masserie. Quasi pianeggiante.",
            zone: "Ostuni"
        },
        {
            name: "Parco Porto Selvaggio",
            lat: 40.1536, lng: 17.9750,
            desc: "Pineta + caletta rocciosa. Sentiero 15 min. Acqua gelida da sorgenti. Natura pura.",
            zone: "Salento"
        }
    ]
};

// Color map for categories
const categoryColors = {
    campsite: '#e74c3c',
    beach: '#3498db',
    culture: '#9b59b6',
    restaurant: '#e67e22',
    nature: '#27ae60'
};

const categoryIcons = {
    campsite: '\u26FA',
    beach: '\uD83C\uDFD6',
    culture: '\uD83C\uDFDB',
    restaurant: '\uD83C\uDF7D',
    nature: '\uD83C\uDF33'
};

// ===================================
// MAP
// ===================================
let map;
let allMarkers = [];
let activeFilter = 'all';

function initMap() {
    const mapEl = document.getElementById('travel-map');
    if (!mapEl) return;

    map = L.map('travel-map', {
        scrollWheelZoom: false
    }).setView([40.8, 17.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);

    // Add route line (approximate)
    const routeCoords = [
        [45.0703, 7.6869],    // Torino
        [43.7180, 13.2140],   // Senigallia
        [41.8822, 16.1767],   // Vieste
        [41.0845, 16.2710],   // Castel del Monte
        [41.2803, 16.4186],   // Trani
        [40.7295, 17.5778],   // Ostuni
        [40.7846, 17.2374],   // Alberobello
        [40.9954, 17.2204],   // Polignano
        [40.3520, 18.1710],   // Lecce
        [40.1456, 18.4908],   // Otranto
        [40.0547, 17.9910],   // Gallipoli
        [39.7933, 18.3554],   // Leuca
        [42.8900, 13.9200],   // Martinsicuro
        [45.0703, 7.6869]     // Torino (ritorno)
    ];

    L.polyline(routeCoords, {
        color: '#1a5276',
        weight: 3,
        opacity: 0.5,
        dashArray: '8, 8'
    }).addTo(map);

    // Start/End marker
    addSpecialMarker(45.0703, 7.6869, 'Torino', 'Partenza e ritorno', '#2c3e50');

    // Add all markers
    Object.keys(mapData).forEach(category => {
        mapData[category].forEach(item => {
            const marker = createMarker(item, category);
            allMarkers.push({ marker, category });
        });
    });

    // Fit bounds to show all of Italy
    map.fitBounds([
        [39.5, 13.5],
        [45.5, 19.0]
    ]);

    // Filter buttons
    document.querySelectorAll('.map-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMarkers(btn.dataset.filter);
        });
    });
}

function createMarker(item, category) {
    const color = categoryColors[category];
    const icon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `<div class="custom-marker" style="background:${color}">${categoryIcons[category]}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
    });

    const marker = L.marker([item.lat, item.lng], { icon })
        .addTo(map)
        .bindPopup(`
            <div class="popup-title">${item.name}</div>
            <div class="popup-type">${item.zone}</div>
            <div class="popup-desc">${item.desc}</div>
        `);

    return marker;
}

function addSpecialMarker(lat, lng, name, desc, color) {
    const icon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `<div class="custom-marker" style="background:${color}; width:32px; height:32px; font-size:16px;">\uD83C\uDFE0</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
    });

    L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<div class="popup-title">${name}</div><div class="popup-desc">${desc}</div>`);
}

function filterMarkers(filter) {
    activeFilter = filter;
    allMarkers.forEach(({ marker, category }) => {
        if (filter === 'all' || filter === category) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
}
