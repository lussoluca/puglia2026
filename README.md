# Puglia 2026

Sito statico per pianificare la vacanza in Puglia dal 23 agosto al 4 settembre 2026: 13 giorni in auto da Alessandria, 12 notti in sei tappe (Montemarciano, Vieste, Ostuni per sei notti, poi Matera, Costa dei Trabocchi e Cervia al rientro).

Pubblicato su GitHub Pages: <https://lussoluca.github.io/puglia2026/>

## Cosa contiene

- Itinerario giorno per giorno con una pagina di dettaglio per ciascuno dei 13 giorni
- Tabella riassuntiva di dove si dorme e cosa si fa ogni giorno
- Consigli degli amici raggruppati per direzione, con i tempi reali di percorrenza da Ostuni
- Mappa interattiva con alloggi, spiagge, borghi, ristoranti e punti naturali
- Spiagge, ristoranti, eventi, meteo tipico, budget e checklist bagagli
- Funziona offline: è una PWA installabile su telefono

## Comandi

| Comando | Cosa fa |
| :--- | :--- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Server di sviluppo su <http://localhost:4321> |
| `npm run build` | Build di produzione in `./dist/` |
| `npm run preview` | Anteprima della build di produzione |
| `bash scripts/update-fuel-price.sh` | Aggiorna il prezzo del GPL dai dati aperti MIMIT |

Serve Node.js >= 22.12.0.

## Come modificare i contenuti

Tutti i testi stanno in `src/data/*.json`: non c'è database né API. Il file `itinerary.json` guida le pagine dei singoli giorni, `daily-locations.json` la tabella riassuntiva: quando cambia il programma vanno aggiornati entrambi.

Dettagli su architettura, workflow e trappole note in [AGENTS.md](AGENTS.md).
