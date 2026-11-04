export const LIMIT = 5 * 1024 * 1024;
export function detectDelimiter(text) {
  const counts = new Map([[",",0],[";",0],["\t",0]]); let quoted=false;
  for(let i=0;i<text.length;i++) {const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}else if(!quoted){if(c==='\r'||c==='\n')break;if(counts.has(c))counts.set(c,counts.get(c)+1);}}
  return [...counts].sort((a,b)=>b[1]-a[1])[0][0];
}
export function parseCSV(text, delimiter="auto") {
  if(typeof text!=="string" || !text.trim())throw new Error("Paste CSV text or choose a file first.");
  if(text.length>LIMIT)throw new Error("This tool accepts up to 5 MB of text.");
  text=text.replace(/^\uFEFF/,""); delimiter=delimiter==="auto"?detectDelimiter(text):delimiter;
  if(![",",";","\t"].includes(delimiter))throw new Error("Choose comma, semicolon, or tab.");
  let rows=[],row=[],field="",quoted=false,closed=false;
  const endField=()=>{row.push(field);field="";closed=false;};
  const endRow=()=>{endField();rows.push(row);row=[];if(rows.length>10001)throw new Error("Use at most 10,000 data records per file.");};
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
    if(c===delimiter){endField();continue;}
    if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;endRow();continue;}
    if(closed)throw new Error(`Unexpected text after a closing quote near record ${rows.length+1}.`);
    if(c==='"'){if(field.length)throw new Error(`Unexpected quote in an unquoted field near record ${rows.length+1}.`);quoted=true;}else field+=c;
  }
  if(quoted)throw new Error("A quoted field is not closed. Check the source file before continuing.");
  if(field.length||row.length||closed)endRow();
  if(!rows.length)throw new Error("The file is empty.");
  return {headers:rows[0],rows:rows.slice(1),delimiter};
}
export function validateTable(table) {
  const {headers,rows}=table;
  if(headers.some(h=>!h.trim()))throw new Error("Every column needs a non-empty header.");
  if(new Set(headers).size!==headers.length)throw new Error("Duplicate column headers need unique names.");
  const bad=rows.findIndex(row=>row.length!==headers.length);
  if(bad!==-1)throw new Error(`Data record ${bad+1} has ${rows[bad].length} fields; expected ${headers.length}. Use the diagnostic to inspect it.`);
  if(!rows.length)throw new Error("The file needs at least one data record.");
  return table;
}
export function diagnose(table) {
  const issues=[];const add=(record,column,kind,value,action)=>issues.push({record,column,kind,value,action});
  table.headers.forEach((h,i)=>{if(!h.trim())add("Header",String(i+1),"Blank header",h,"Name this column.");if(table.headers.indexOf(h)!==i)add("Header",h,"Repeated header",h,"Use a unique column name.");});
  table.rows.forEach((row,index)=>{
    if(row.length!==table.headers.length)add(index+1,"Whole record","Field count",String(row.length),`Expected ${table.headers.length} fields. Inspect quoting and delimiters.`);
    row.forEach((value,col)=>{
      const column=table.headers[col]||`Column ${col+1}`;const trimmed=value.trim();
      if(!trimmed)add(index+1,column,"Blank value",value,"Decide whether this field is required. Keep blank distinct from zero.");
      if(/^0\d+$/.test(trimmed))add(index+1,column,"Leading zero",value,"Import this identifier as Text.");
      if(/^\d{16,}$/.test(trimmed))add(index+1,column,"Long identifier",value,"Import as Text to avoid spreadsheet precision loss.");
      if(/^[=+@\-\t\r]/.test(value)||/^\s+[=+@\-]/.test(value))add(index+1,column,"Formula-like text",value,"Inspect before opening in a spreadsheet. Use a text-typed import.");
      if(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(trimmed))add(index+1,column,"Date convention",value,"Confirm day/month/year or month/day/year before conversion.");
      if(value!==trimmed)add(index+1,column,"Outer whitespace",value,"Review before trimming. Spaces may be meaningful in identifiers.");
    });
  });
  return {records:table.rows.length,columns:table.headers.length,issues};
}
export function compareTables(left,right,key) {
  validateTable(left);validateTable(right);
  const li=left.headers.indexOf(key),ri=right.headers.indexOf(key);
  if(li<0||ri<0)throw new Error("Choose a key column that exists in both files.");
  if(left.headers.length!==right.headers.length||left.headers.some(h=>!right.headers.includes(h)))throw new Error("The files need the same unique column names; column order may differ.");
  const grouped=(table,col)=>{const map=new Map();table.rows.forEach((row,i)=>{const id=row[col];if(!id.trim())throw new Error(`A key is blank in data record ${i+1}. Fix it before comparing.`);if(!map.has(id))map.set(id,[]);map.get(id).push(row);});return map;};
  const a=grouped(left,li),b=grouped(right,ri);const ids=new Set([...a.keys(),...b.keys()]);const results=[];
  for(const id of ids){const aa=a.get(id)||[],bb=b.get(id)||[];let status;
    if(aa.length>1||bb.length>1)status="Repeated key — review";
    else if(!aa.length)status="Only in B";else if(!bb.length)status="Only in A";
    else status=left.headers.every((h,i)=>aa[0][i]===bb[0][right.headers.indexOf(h)])?"Unchanged":"Changed";
    results.push({key:id,status,countA:aa.length,countB:bb.length,rowA:aa[0]||[],rowB:bb[0]||[]});
  }
  return {results,counts:Object.fromEntries(["Unchanged","Changed","Only in A","Only in B","Repeated key — review"].map(status=>[status,results.filter(r=>r.status===status).length]))};
}
export function reviewDate(value,convention="review") {
  const text=value.trim();if(!text)return {status:"Blank",iso:"",note:"No date supplied."};
  let y,m,d;let match=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(match){[,y,m,d]=match.map(Number);}else{
    match=text.match(/^(\d{1,2})([\/-])(\d{1,2})\2(\d{4})$/);
    if(!match)return {status:"Invalid",iso:"",note:"Use YYYY-MM-DD or a numeric date with a four-digit year."};
    const a=Number(match[1]),b=Number(match[3]);y=Number(match[4]);
    if(a<=12&&b<=12&&a!==b&&convention==="review")return {status:"Ambiguous",iso:"",note:`Could be ${String(a).padStart(2,"0")}/${String(b).padStart(2,"0")} in either date convention. Choose a rule.`};
    if(convention==="mdy"){m=a;d=b;}else if(convention==="dmy"){d=a;m=b;}else if(a>12){d=a;m=b;}else if(b>12){m=a;d=b;}else{d=a;m=b;}
  }
  const date=new Date(Date.UTC(y,m-1,d));
  if(y<1900||y>9999||date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return {status:"Invalid",iso:"",note:"This calendar date does not exist or is outside 1900–9999."};
  return {status:"Converted",iso:`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`,note:"Confirmed using the selected rule."};
}
export function csvText(rows,{spreadsheetSafe=false}={}) {
  return rows.map(row=>row.map(value=>{let s=String(value??"");if(spreadsheetSafe&&/^[\s]*[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(",")).join("\r\n")+"\r\n";
}
