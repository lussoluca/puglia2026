#!/usr/bin/env bash
# Update diesel fuel price from MIMIT open data CSV
# Source: https://www.mimit.gov.it/images/exportCSV/prezzo_alle_8.csv
# Published daily by Ministero delle Imprese e del Made in Italy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUDGET_FILE="$PROJECT_DIR/src/data/budget.json"
CSV_URL="https://www.mimit.gov.it/images/exportCSV/prezzo_alle_8.csv"
TMP_CSV="$(mktemp)"

echo "Downloading fuel prices from MIMIT..."
curl -sL "$CSV_URL" -o "$TMP_CSV"

# Extract the date from the first line: "Estrazione del 2026-04-14"
DATA_DATE=$(head -1 "$TMP_CSV" | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}')
echo "Data date: $DATA_DATE"

# Compute national average for Gasolio (diesel) self-service
DIESEL_PRICE=$(awk -F'|' 'NR>2 && $2=="Gasolio" && $4==1 && $3+0 > 0.5 && $3+0 < 5.0 {sum+=$3; count++} END {printf "%.3f", sum/count}' "$TMP_CSV")
STATION_COUNT=$(awk -F'|' 'NR>2 && $2=="Gasolio" && $4==1 && $3+0 > 0.5 && $3+0 < 5.0 {count++} END {print count}' "$TMP_CSV")

echo "National average diesel (self): ${DIESEL_PRICE} EUR/L (from ${STATION_COUNT} stations)"

if [ -z "$DIESEL_PRICE" ] || [ "$DIESEL_PRICE" = "0.000" ]; then
  echo "ERROR: Could not compute diesel price. Aborting."
  rm -f "$TMP_CSV"
  exit 1
fi

# Compute new fuel total: 240L * price
FUEL_TOTAL=$(awk "BEGIN {printf \"%.0f\", 240 * $DIESEL_PRICE}")
echo "Estimated fuel cost: ~${FUEL_TOTAL} EUR (240L x ${DIESEL_PRICE} EUR/L)"

# Update budget.json using node for safe JSON manipulation
node -e "
const fs = require('fs');
const budget = JSON.parse(fs.readFileSync('$BUDGET_FILE', 'utf8'));

// Update fuel category
const fuelCat = budget.categories.find(c => c.title === 'Carburante');
if (fuelCat) {
  fuelCat.items = [
    'Totale litri: ~240 L',
    'Prezzo diesel: ~${DIESEL_PRICE}€/L (media nazionale self)'
  ];
  fuelCat.total = '~${FUEL_TOTAL}€';
}

// Update fuel metadata
budget.fuelPrice = {
  price: ${DIESEL_PRICE},
  date: '${DATA_DATE}',
  source: 'MIMIT - Ministero delle Imprese e del Made in Italy',
  sourceUrl: 'https://www.mimit.gov.it/it/prezzo-medio-carburanti/regioni',
  stations: ${STATION_COUNT}
};

// Recalculate grand total
const total = budget.categories.reduce((sum, cat) => {
  const num = parseInt(cat.total.replace(/[^0-9]/g, ''));
  return sum + (isNaN(num) ? 0 : num);
}, 0);
// Round to nearest 50
const rounded = Math.round(total / 50) * 50;
budget.grandTotal = '~' + rounded + '€';

fs.writeFileSync('$BUDGET_FILE', JSON.stringify(budget, null, 2) + '\n');
console.log('Updated budget.json: fuel=' + '${DIESEL_PRICE}' + ' EUR/L, total=~' + rounded + ' EUR');
"

rm -f "$TMP_CSV"
echo "Done."
