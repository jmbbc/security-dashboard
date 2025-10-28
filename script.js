function parseFlexibleDate(s){
  if (!s) return null;
  if (s instanceof Date) return isNaN(s.getTime()) ? null : s;
  if (typeof s === 'number') return new Date((s - 25569) * 86400000);
  const str = String(s).trim();
  const iso = new Date(str);
  if (!isNaN(iso.getTime())) return iso;
  const m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m){
    let [day, month, year] = [parseInt(m[1]), parseInt(m[2])-1, parseInt(m[3])];
    if (year < 100) year += 2000;
    return new Date(year, month, day, m[4]||0, m[5]||0, m[6]||0);
  }
  return new Date(str.replace(/\//g,'-').split(' ')[0]);
}

function formatDateDDMMYYYY(ts){
  const d = parseFlexibleDate(ts);
  return d ? d.toLocaleDateString('en-GB') : '';
}

function normalizeRow(r){
  const out = { ...r };

  // Nama pelawat
  out.displayName = r['Nama'] || r['Name'] || r['VisitorName'] || r['Visitor'] || '';

  // Kategori pendaftaran
  out.displayCategory = r['Pilih pendaftaran'] || r['Category'] || r['CategoryActivity'] || '';

  // Unit kediaman
  out.displayUnit = r['Unit'] || r['ResidentUnit'] || r['Unit rumah'] || '';

  // Tarikh ETA dan ETD mentah
  out._ETA = r._ETA || r.ETA || r['Eta'] || r['ETA'] || r.Timestamp || '';
  out._ETD = r._ETD || r.ETD || r['Etd'] || r['ETD'] || '';

  // Format paparan tarikh
  out.displayETA = formatDateDDMMYYYY(out._ETA);
  out.displayETD = formatDateDDMMYYYY(out._ETD);

  // Pastikan __row wujud untuk fungsi update
  out.__row = r.__row || r.Row || r.row || r['Row Number'] || r['Row'] || null;

  return out;
}
