import {parseCSV,validateTable,diagnose,compareTables,reviewDate,csvText,reconcileSales,formatCents} from './lib/csv.mjs';
import {files} from './lib/samples.mjs';
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
