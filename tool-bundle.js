(()=>{
"use strict";
const LIMIT = 5 * 1024 * 1024;
function detectDelimiter(text) {
  const counts = new Map([[",",0],[";",0],["\t",0]]); let quoted=false;
  for(let i=0;i<text.length;i++) {const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}else if(!quoted){if(c==='\r'||c==='\n')break;if(counts.has(c))counts.set(c,counts.get(c)+1);}}
  return [...counts].sort((a,b)=>b[1]-a[1])[0][0];
}
function parseCSV(text, delimiter="auto") {
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
function validateTable(table) {
  const {headers,rows}=table;
  if(headers.some(h=>!h.trim()))throw new Error("Every column needs a non-empty header.");
  if(new Set(headers).size!==headers.length)throw new Error("Duplicate column headers need unique names.");
  const bad=rows.findIndex(row=>row.length!==headers.length);
  if(bad!==-1)throw new Error(`Data record ${bad+1} has ${rows[bad].length} fields; expected ${headers.length}. Use the diagnostic to inspect it.`);
  if(!rows.length)throw new Error("The file needs at least one data record.");
  return table;
}
function diagnose(table) {
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
function compareTables(left,right,key) {
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
function reviewDate(value,convention="review") {
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
function csvText(rows,{spreadsheetSafe=false}={}) {
  return rows.map(row=>row.map(value=>{let s=String(value??"");if(spreadsheetSafe&&/^[\s]*[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}).join(",")).join("\r\n")+"\r\n";
}

function parseRMCents(value) {
  let text=String(value).trim();let negative=false;
  if(text.startsWith('(')&&text.endsWith(')')){negative=true;text=text.slice(1,-1).trim();}
  text=text.replace(/^RM\s*/i,'');
  if(text.startsWith('-')){if(negative)throw new Error('Use either parentheses or a minus sign, not both.');negative=true;text=text.slice(1);}
  if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text))throw new Error('Use an amount such as RM12.50 or 1,234.50; blank and other decimal conventions need review.');
  const [whole,fraction='']=text.replaceAll(',','').split('.');const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  if(!Number.isSafeInteger(cents))throw new Error('Amount exceeds the supported exact cent range.');
  return negative?-cents:cents;
}

function formatCents(cents,{grouping=false}={}) {
  if(cents===null)return '';
  if(!Number.isSafeInteger(cents))throw new Error('Amount exceeds the supported exact cent range.');
  const digits=String(Math.abs(cents)).padStart(3,'0'),fraction=digits.slice(-2);
  const whole=grouping?digits.slice(0,-2).replace(/\B(?=(\d{3})+(?!\d))/g,','):digits.slice(0,-2);
  return (cents<0?'-':'')+whole+'.'+fraction;
}

function reconcileSales(table,{start,end,convention='review',removeExactDuplicates=false,status='Shipped'}={}) {
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

const headers=['order_id','line_id','order_date','customer_code','phone','sku','quantity','unit_price_rm','discount_rm','status','note'];
const sourceRows=[
['000101','1','26/10/2026','C001','0123456789','NOTE-A5','2','RM12.50','RM0.00','Shipped','Front desk'],
['000101','2','26/10/2026','C001','0123456789','PEN-BLK','3','RM3.20','RM0.00','Shipped','Same order, different line'],
['000102','1','27/10/2026','C002','01123456789','MUG-WHT','1','RM25.00','RM5.00','Shipped','Gift, no price tag'],
['000103','1','28/10/2026','C003','0134567890','NOTE-A5','4','RM12.50','RM2.00','Shipped','Leave with reception'],
['000103','1','28/10/2026','C003','0134567890','NOTE-A5','4','RM12.50','RM2.00','Shipped','Leave with reception'],
['000104','1','29/10/2026','C004','0145678901','BAG-CNV','2','RM35.00','RM0.00','Cancelled','Order cancelled'],
['000105','1','30/10/2026','C005','0156789012','MUG-WHT','2','RM25.00','RM0.00','Shipped','Line one\nLine two'],
['000106','1','31/10/2026','C006','0167890123','BAG-CNV','1','RM35.00','RM5.00','Shipped','Call before delivery'],
['000107','1','01/11/2026','C007','0178901234','PEN-BLK','10','RM3.20','RM2.00','Shipped','Public sample only'],
['000108','1','01/11/2026','C008','0189012345','NOTE-A5','1','RM12.50','RM0.00','Pending','Awaiting payment'],
['000109','1','25/10/2026','C009','0190123456','BAG-CNV','1','RM35.00','RM0.00','Shipped','Before reporting week'],
['000110','1','02/11/2026','C010','0101234567','MUG-WHT','1','RM25.00','RM0.00','Shipped','After reporting week'],
['000111','1','28/10/2026','C011','0122222222','NOTE-A5','2','RM12.50','RM5.00','Shipped','Fictional record'],
['000112','1','30/10/2026','C012','0133333333','BAG-CNV','1','RM35.00','RM0.00','Shipped','Fictional record']
];
const cleanRows=sourceRows.filter((row,i,all)=>all.findIndex(r=>JSON.stringify(r)===JSON.stringify(row))===i).map(r=>[...r.slice(0,2),r[2].split('/').reverse().join('-'),...r.slice(3,6),Number(r[6]),Number(r[7].replace('RM','')),Number(r[8].replace('RM','')),...r.slice(9)]);
const includedRows=cleanRows.filter(r=>r[2]>='2026-10-26'&&r[2]<'2026-11-02'&&r[9]==='Shipped');
const summary={sourceRecords:14,uniqueRecords:13,exactDuplicates:1,includedLines:includedRows.length,orders:new Set(includedRows.map(r=>r[0])).size,units:includedRows.reduce((s,r)=>s+r[6],0),gross:includedRows.reduce((s,r)=>s+Math.round(r[6]*r[7]*100),0)/100,discount:includedRows.reduce((s,r)=>s+Math.round(r[8]*100),0)/100,net:includedRows.reduce((s,r)=>s+Math.round((r[6]*r[7]-r[8])*100),0)/100};
const comparisonHeaders=['order_id','status','amount_rm'];
const comparisonA=[['000101','Shipped','34.60'],['000102','Pending','20.00'],['000103','Shipped','48.00'],['000104','Cancelled','70.00'],['000105','Pending','50.00'],['000105','Pending','50.00']];
const comparisonB=[['000101','Shipped','34.60'],['000102','Shipped','20.00'],['000104','Cancelled','70.00'],['000105','Shipped','50.00'],['000106','Shipped','30.00']];
const dateRows=[['A','03/04/2026'],['B','28/10/2026'],['C','10/28/2026'],['D','2026-11-01'],['E','31/02/2026'],['F',''],['G','29/02/2024']];
const files={
 'orders-messy.csv':csvText([headers,...sourceRows]),
 'orders-clean.csv':csvText([headers,...cleanRows]),
 'orders-report-lines.csv':csvText([headers,...includedRows]),
 'orders-a.csv':csvText([comparisonHeaders,...comparisonA]),
 'orders-b.csv':csvText([comparisonHeaders,...comparisonB]),
 'mixed-dates.csv':csvText([['row_id','date'],...dateRows]),
 'import-edge-cases.csv':csvText([['record_id','phone','reference','note'],['00001','0123456789','123456789012345678','Comma, in a note'],['00002','01123456789','3-12','Two lines\ninside quotes'],['00003','+60123456789','12E3','=1+1'],['00004','','00721','Quotes: "hello"']]),
 'amounts-practice.csv':csvText([['raw_amount','expected_rm','rule'],['RM 1,234.50','1234.50','Remove RM, comma, and spaces'],['(RM25.00)','-25.00','Parentheses mean negative in this sample'],['0.00','0','A valid zero'],['','','Missing stays missing'],['12,50','','Unresolved decimal convention']]),
 'lookup-practice.csv':csvText([['raw_key','clean_key','reason'],['PEN-BLK','PEN-BLK','Exact match'],['PEN-BLK ','PEN-BLK','Trailing ASCII space'],['PEN-BLK\u00a0','PEN-BLK','Trailing nonbreaking space'],['00123','00123','Keep identifier text; do not convert to 123']]),
 'refresh-next-week.csv':csvText([headers,['000201','1','02/11/2026','C020','0120000001','NOTE-A5','3','RM12.50','RM2.50','Shipped','Next-week refresh sample'],['000202','1','03/11/2026','C021','0120000002','MUG-WHT','2','RM25.00','RM0.00','Shipped','Next-week refresh sample']]),
 'method-comparison.csv':csvText([['method','setup_minutes','work_minutes','review_minutes','verified_output','notes'],['Excel built-in','','','','','Enter your own observed measurements'],['Browser tools','','','','','Use the same dataset and scope'],['AI-assisted','','','','','Include prompting and corrections']])
};

const $=s=>document.querySelector(s);
const shell=$('[data-lab-tool]');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let exportRows=null,loadVersion=0;
function invalidate(){loadVersion++;exportRows=null;$('#export').disabled=true;$('#result').replaceChildren();}
function renderTable(head,rows){return `<div class="data-wrap"><table${head.length<=3?' class="compact"':''}><thead><tr>${head.map(c=>`<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function stats(values){return `<div class="result-summary">${values.map(([n,l])=>`<div class="result-stat"><strong>${escape(n)}</strong>${escape(l)}</div>`).join('')}</div>`;}
function message(error){$('#result').innerHTML=`<div class="error-box" role="alert">${escape(error.message)}</div>`;}
function table(selector){return parseCSV($(selector).value,$('#delimiter').value);}
function loadSample(){invalidate();const kind=shell.dataset.labTool;
 if(kind==='diagnostic')$('#csv-input').value=files['orders-messy.csv'];
 if(kind==='compare'){$('#csv-a').value=files['orders-a.csv'];$('#csv-b').value=files['orders-b.csv'];$('#key').value='order_id';}
 if(kind==='dates'){$('#csv-input').value=files['mixed-dates.csv'];$('#date-column').value='date';$('#convention').value='review';}
 if(kind==='sales'){$('#csv-input').value=files['orders-messy.csv'];$('#report-start').value='2026-10-26';$('#report-end').value='2026-11-02';$('#convention').value='dmy';$('#remove-repeats').checked=true;}
 $('#result').innerHTML='<p class="result-note">Fictional sample loaded. Run the tool to see its results.</p>';
}
for(const input of shell.querySelectorAll('textarea,select,input')){input.addEventListener('input',invalidate);input.addEventListener('change',invalidate);}
for(const input of shell.querySelectorAll('input[type=file]'))input.addEventListener('change',async()=>{invalidate();const version=loadVersion;try{const file=input.files[0];if(!file)return;if(file.size>5*1024*1024)throw new Error('Choose a file of 5 MB or less.');const text=await file.text();if(version!==loadVersion)return;$(input.dataset.target).value=text;$('#result').innerHTML='<p class="result-note">File read locally. Run the tool to inspect it.</p>';}catch(error){if(version===loadVersion)message(error);}});
$('#sample').addEventListener('click',loadSample);
$('#run').addEventListener('click',()=>{invalidate();try{
 const kind=shell.dataset.labTool;let html='';
 if(kind==='diagnostic'){
  const input=table('#csv-input'),report=diagnose(input);exportRows=[['data_record','column','finding','original_value','next_step'],...report.issues.map(r=>[r.record,r.column,r.kind,r.value,r.action])];
  html=stats([[report.records,'data records'],[report.columns,'columns'],[report.issues.length,'findings']]);
  html+=`<p class="result-note">Delimiter: ${escape(input.delimiter==='\t'?'tab':input.delimiter===','?'comma':'semicolon')}. One cell may have more than one finding. Data-record numbers exclude the header and count quoted multiline fields as one record.</p>`;
  html+=report.issues.length?renderTable(['Record','Column','Finding','Value','Next step'],report.issues.slice(0,150).map(r=>[r.record,r.column,r.kind,r.value,r.action])):'<p>No listed import risks found. This does not validate the business meaning of your data.</p>';
  html+=renderTable(input.headers,input.rows.slice(0,8));
 }
 if(kind==='compare'){
  const a=table('#csv-a'),b=table('#csv-b'),key=$('#key').value;const report=compareTables(a,b,key);
  html=stats(Object.entries(report.counts).map(([label,n])=>[n,label]));
  html+=`<p class="result-note">File A: ${a.rows.length} records. File B: ${b.rows.length} records. Results: ${report.results.length} distinct exact keys. Matching is case-sensitive and preserves spaces. Repeated keys require review and are never silently merged.</p>`;
  html+=renderTable(['Key','Status','Rows in A','Rows in B','Changed fields'],report.results.slice(0,150).map(r=>[r.key,r.status,r.countA,r.countB,r.differences.map(d=>`${d.column}: ${d.before} → ${d.after}`).join('\n')||'—']));
  for(const repeated of report.results.filter(r=>r.status==='Repeated key — review').slice(0,50))html+=`<details class="record-detail"><summary>Inspect repeated records for ${escape(repeated.key)} (${repeated.countA} in A, ${repeated.countB} in B)</summary>${renderTable(['File','Row within key',...a.headers],[...repeated.rowsA.slice(0,50).map((r,i)=>['A',i+1,...r]),...repeated.rowsB.slice(0,50).map((r,i)=>['B',i+1,...a.headers.map(h=>r[b.headers.indexOf(h)])])])}<p class="result-note">Preview: up to 50 records from each file per group and 50 repeated-key groups. The download retains every record for every group.</p></details>`;
  exportRows=[['key','status','rows_in_a','rows_in_b','changed_fields','all_rows_a','all_rows_b'],...report.results.map(r=>[r.key,r.status,r.countA,r.countB,JSON.stringify(r.differences),JSON.stringify(r.rowsA.map(row=>Object.fromEntries(a.headers.map((h,i)=>[h,row[i]])))),JSON.stringify(r.rowsB.map(row=>Object.fromEntries(b.headers.map((h,i)=>[h,row[i]]))))])];
 }
 if(kind==='dates'){
  const input=validateTable(table('#csv-input')),col=input.headers.indexOf($('#date-column').value);
  if(col<0)throw new Error('Enter the exact name of your date column. The sample uses date.');
  const results=input.rows.map((r,i)=>({record:i+1,value:r[col],...reviewDate(r[col],$('#convention').value)}));
  html=stats(['Converted','Ambiguous','Invalid','Blank'].map(status=>[results.filter(r=>r.status===status).length,status]));
  html+=renderTable(['Record','Original','Status','Proposed ISO date','Explanation'],results.slice(0,150).map(r=>[r.record,r.value,r.status,r.iso,r.note]));
  html+='<p class="result-note">This is a review report. Unresolved values stay visible and are not replaced in your original file. The selected date convention applies to every non-ISO date, including values that conflict with that convention.</p>';
  exportRows=[['data_record','original_date','status','proposed_iso_date','explanation'],...results.map(r=>[r.record,r.value,r.status,r.iso,r.note])];
 }
 if(kind==='sales'){
  const input=table('#csv-input');const report=reconcileSales(input,{start:$('#report-start').value,end:$('#report-end').value,convention:$('#convention').value,removeExactDuplicates:$('#remove-repeats').checked});
  const money=cents=>formatCents(cents,{grouping:true});
  const c=report.counts;
  html=stats([[c.source,'source records'],[c.included,'included lines'],[c.removed,'exact repeats removed'],[c.outside,'outside date window'],[c.otherStatus,'other status'],[c.unresolved,'need review']]);
  if(report.totals){const t=report.totals;html+=`<div class="sales-total"><span>NET SHIPPED SALES${report.repeatedKept?' · REPEATED RECORDS KEPT':''}</span><strong>RM ${money(t.netCents)}</strong><p>${t.units} units · ${t.lines} lines · ${t.orders} distinct orders</p><p>RM ${money(t.grossCents)} gross − RM ${money(t.discountCents)} discounts = RM ${money(t.netCents)} net</p></div>`;
    if(report.repeatedKept)html+=`<p class="error-box">${report.repeatedKept} exact repeated record(s) remain in the source and may be counted. Confirm the source's row meaning before choosing to remove them.</p>`;
    html+=renderTable(['SKU','Units','Net sales (RM)'],report.products.map(p=>[p.sku,p.units,money(p.netCents)]));
  }else html+='<div class="error-box" role="alert">Resolve every “Needs review” record before a total can be calculated. The audit lists the fields to correct.</div>';
  html+=`<p class="result-note">Window: ${escape(report.start)} inclusive to ${escape(report.end)} exclusive. Eligible status: exactly Shipped. Source count ${c.source} = ${c.included} included + ${c.removed} repeats removed + ${c.outside} outside the window + ${c.otherStatus} other status + ${c.unresolved} needing review.</p>`;
  html+=renderTable(['Record','Order / line','Decision','Date','Net (RM)','Reason'],report.audit.slice(0,150).map(r=>[r.record,`${r.order} / ${r.line}`,r.decision,r.date,money(r.netCents),r.reason]));
  exportRows=[['data_record','decision','order_id','line_id','source_date','iso_date','source_status','quantity','gross_rm','discount_rm','net_rm','reason','original_source_record'],...report.audit.map(r=>[r.record,r.decision,r.order,r.line,r.sourceDate,r.date,r.sourceStatus,r.quantity,formatCents(r.grossCents),formatCents(r.discountCents),formatCents(r.netCents),r.reason,JSON.stringify(Object.fromEntries(input.headers.map((h,i)=>[h,r.original[i]])))])];
 }
 html+='<p class="result-note">Showing at most 150 result rows. The download includes all result rows. CSV has no column types: import identifiers as Text when opening the report in a spreadsheet. Formula-like cells receive a leading apostrophe in the downloaded review report.</p>';
 $('#result').innerHTML=html;$('#export').disabled=false;$('#result').focus();
 }catch(error){message(error);}});
$('#export').addEventListener('click',()=>{if(!exportRows)return;const blob=new Blob(['\uFEFF'+csvText(exportRows,{spreadsheetSafe:true})],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${shell.dataset.labTool}-review.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#clear')?.addEventListener('click',()=>{for(const field of shell.querySelectorAll('textarea,input')){if(field.type==='checkbox')field.checked=false;else field.value='';}for(const field of shell.querySelectorAll('select'))field.selectedIndex=0;invalidate();$('#result').innerHTML='<p class="result-note">Inputs and results cleared from this page.</p>';});

})();
