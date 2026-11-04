export const LIMIT = 5 * 1024 * 1024;
export function detectDelimiter(text) {
  const counts = new Map([[",",0],[";",0],["\t",0]]); let quoted=false;
  for(let i=0;i<text.length;i++) {const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}else if(!quoted){if(c==='\r'||c==='\n')break;if(counts.has(c))counts.set(c,counts.get(c)+1);}}
  return [...counts].sort((a,b)=>b[1]-a[1])[0][0];
}
export function parseCSV(text, delimiter="auto") {
  if(typeof text!=="string" || !text.trim())throw new Error("Paste CSV text or choose a file first.");
  if(new TextEncoder().encode(text).byteLength>LIMIT)throw new Error("This tool accepts up to 5 MB of text.");
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
    const differences=aa.length===1&&bb.length===1?left.headers.flatMap((column,index)=>aa[0][index]===bb[0][right.headers.indexOf(column)]?[]:[{column,before:aa[0][index],after:bb[0][right.headers.indexOf(column)]}]):[];
    results.push({key:id,status,countA:aa.length,countB:bb.length,rowA:aa[0]||[],rowB:bb[0]||[],rowsA:aa,rowsB:bb,differences});
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

export function parseRMCents(value) {
  let text=String(value).trim();let negative=false;
  if(text.startsWith('(')&&text.endsWith(')')){negative=true;text=text.slice(1,-1).trim();}
  text=text.replace(/^RM\s*/i,'');
  if(text.startsWith('-')){if(negative)throw new Error('Use either parentheses or a minus sign, not both.');negative=true;text=text.slice(1);}
  if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text))throw new Error('Use an amount such as RM12.50 or 1,234.50; blank and other decimal conventions need review.');
  const [whole,fraction='']=text.replaceAll(',','').split('.');const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  if(!Number.isSafeInteger(cents))throw new Error('Amount exceeds the supported exact cent range.');
  return negative?-cents:cents;
}

export function formatCents(cents,{grouping=false}={}) {
  if(cents===null)return '';
  if(!Number.isSafeInteger(cents))throw new Error('Amount exceeds the supported exact cent range.');
  const digits=String(Math.abs(cents)).padStart(3,'0'),fraction=digits.slice(-2);
  const whole=grouping?digits.slice(0,-2).replace(/\B(?=(\d{3})+(?!\d))/g,','):digits.slice(0,-2);
  return (cents<0?'-':'')+whole+'.'+fraction;
}

export function reconcileSales(table,{start,end,convention='review',removeExactDuplicates=false,status='Shipped'}={}) {
  validateTable(table);
  const startCheck=reviewDate(start||''),endCheck=reviewDate(end||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start||'')||!/^\d{4}-\d{2}-\d{2}$/.test(end||'')||!startCheck.iso||!endCheck.iso||start>=end)throw new Error('Choose valid ISO start and exclusive end dates, with the end after the start.');
  if(!['review','dmy','mdy'].includes(convention))throw new Error('Choose a supported source date convention.');
  const columns=['order_id','line_id','order_date','sku','quantity','unit_price_rm','discount_rm','status'];
  const missing=columns.filter(name=>!table.headers.includes(name));if(missing.length)throw new Error('Missing required columns: '+missing.join(', '));
  const pos=Object.fromEntries(columns.map(name=>[name,table.headers.indexOf(name)]));
  const fingerprints=new Map(),lineVersions=new Map();
  table.rows.forEach(row=>{const key=JSON.stringify([row[pos.order_id],row[pos.line_id]]);if(!lineVersions.has(key))lineVersions.set(key,new Set());lineVersions.get(key).add(JSON.stringify(row));});
  const audit=[];let removed=0,repeated=0;
  table.rows.forEach((row,index)=>{
    const item={record:index+1,original:row,order:row[pos.order_id],line:row[pos.line_id],sku:row[pos.sku],sourceDate:row[pos.order_date],sourceStatus:row[pos.status],decision:'',reason:'',date:'',quantity:null,grossCents:null,discountCents:null,netCents:null};
    const fingerprint=JSON.stringify(row),first=fingerprints.get(fingerprint);if(first){repeated++;if(removeExactDuplicates){removed++;item.decision='Exact repeat removed';item.reason=`Identical to data record ${first} across every source column.`;audit.push(item);return;}}else fingerprints.set(fingerprint,index+1);
    const problems=[];
    for(const name of ['order_id','line_id','sku']){if(!row[pos[name]].trim())problems.push(`${name} is blank`);else if(row[pos[name]]!==row[pos[name]].trim())problems.push(`${name} has outer spaces`);}
    if(lineVersions.get(JSON.stringify([item.order,item.line])).size>1)problems.push('The order and line key has conflicting source records; reconcile the source first');
    const parsedDate=reviewDate(item.sourceDate,convention);if(parsedDate.status!=='Converted')problems.push(`Date is ${parsedDate.status.toLowerCase()}`);else item.date=parsedDate.iso;
    const qty=row[pos.quantity];if(!/^\d+$/.test(qty)||!Number.isSafeInteger(Number(qty))||Number(qty)<1)problems.push('Quantity must be a positive whole number');else item.quantity=Number(qty);
    let price=null;try{price=parseRMCents(row[pos.unit_price_rm]);if(price<0){problems.push('Unit price cannot be negative in this sales-line tool');price=null;}}catch(error){problems.push('Unit price: '+error.message);}
    try{item.discountCents=parseRMCents(row[pos.discount_rm]);if(item.discountCents<0){problems.push('Discount cannot be negative in this sales-line tool');item.discountCents=null;}}catch(error){problems.push('Discount: '+error.message);}
    if(!item.sourceStatus.trim())problems.push('Status is blank');
    if(item.quantity!==null&&price!==null){item.grossCents=item.quantity*price;if(!Number.isSafeInteger(item.grossCents)){problems.push('Line gross exceeds the supported exact cent range');item.grossCents=null;}}
    if(item.grossCents!==null&&item.discountCents!==null){item.netCents=item.grossCents-item.discountCents;if(item.discountCents>item.grossCents)problems.push('Line discount exceeds gross; refunds and returns need a separate workflow');}
    if(problems.length){item.decision='Needs review';item.reason=problems.map(problem=>problem.replace(/\.+$/,'')).join('. ')+'.';}
    else if(item.date<start||item.date>=end){item.decision='Outside date window';item.reason='The start is inclusive and the end is exclusive.';}
    else if(item.sourceStatus!==status){item.decision='Other status';item.reason=`Status is ${item.sourceStatus}; the report includes exactly ${status}.`;}
    else{item.decision='Included';item.reason=first?`Exact repeat of data record ${first} kept because removal is off.`:'Date and status meet the report rules.';}
    audit.push(item);
  });
  const unresolved=audit.filter(row=>row.decision==='Needs review').length;
  const counts={source:table.rows.length,included:audit.filter(row=>row.decision==='Included').length,removed,outside:audit.filter(row=>row.decision==='Outside date window').length,otherStatus:audit.filter(row=>row.decision==='Other status').length,unresolved};
  let totals=null,products=[];
  if(!unresolved){const included=audit.filter(row=>row.decision==='Included'),bySku=new Map();totals={grossCents:0,discountCents:0,netCents:0,units:0,orders:new Set(included.map(row=>row.order)).size,lines:included.length};
    for(const row of included){totals.grossCents+=row.grossCents;totals.discountCents+=row.discountCents;totals.netCents+=row.netCents;totals.units+=row.quantity;if(!bySku.has(row.sku))bySku.set(row.sku,{sku:row.sku,units:0,netCents:0});const product=bySku.get(row.sku);product.units+=row.quantity;product.netCents+=row.netCents;}
    if(Object.values(totals).some(value=>!Number.isSafeInteger(value)))throw new Error('Combined totals exceed the supported exact range. Split the source into smaller verified reports.');
    products=[...bySku.values()];
  }
  return {audit,counts,totals,products,repeatedKept:removeExactDuplicates?0:repeated,start,end,status};
}
