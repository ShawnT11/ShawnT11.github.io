import { csvText } from './csv.mjs';
export const headers=['order_id','line_id','order_date','customer_code','phone','sku','quantity','unit_price_rm','discount_rm','status','note'];
export const sourceRows=[
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
export const cleanRows=sourceRows.filter((row,i,all)=>all.findIndex(r=>JSON.stringify(r)===JSON.stringify(row))===i).map(r=>[...r.slice(0,2),r[2].split('/').reverse().join('-'),...r.slice(3,6),Number(r[6]),Number(r[7].replace('RM','')),Number(r[8].replace('RM','')),...r.slice(9)]);
export const includedRows=cleanRows.filter(r=>r[2]>='2026-10-26'&&r[2]<'2026-11-02'&&r[9]==='Shipped');
export const summary={sourceRecords:14,uniqueRecords:13,exactDuplicates:1,includedLines:includedRows.length,orders:new Set(includedRows.map(r=>r[0])).size,units:includedRows.reduce((s,r)=>s+r[6],0),gross:includedRows.reduce((s,r)=>s+Math.round(r[6]*r[7]*100),0)/100,discount:includedRows.reduce((s,r)=>s+Math.round(r[8]*100),0)/100,net:includedRows.reduce((s,r)=>s+Math.round((r[6]*r[7]-r[8])*100),0)/100};
export const comparisonHeaders=['order_id','status','amount_rm'];
export const comparisonA=[['000101','Shipped','34.60'],['000102','Pending','20.00'],['000103','Shipped','48.00'],['000104','Cancelled','70.00'],['000105','Pending','50.00'],['000105','Pending','50.00']];
export const comparisonB=[['000101','Shipped','34.60'],['000102','Shipped','20.00'],['000104','Cancelled','70.00'],['000105','Shipped','50.00'],['000106','Shipped','30.00']];
export const dateRows=[['A','03/04/2026'],['B','28/10/2026'],['C','10/28/2026'],['D','2026-11-01'],['E','31/02/2026'],['F',''],['G','29/02/2024']];
export const files={
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
