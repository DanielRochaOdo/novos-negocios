/**
 * Exportação OOXML (.xlsx) sem dependências externas.
 * Dados são enviados pelo backend conforme permissões do perfil.
 * Strings são gravadas como inlineStr (nunca fórmulas) para impedir execução
 * de conteúdo que porventura comece com =, +, - ou @.
 */
export type CompanyExportRow={
  id:number;name:string;cnpj?:string|null;stage:string;ownerName?:string|null;
  responsible?:string|null;phone?:string|null;email?:string|null;address?:string|null;
  employees?:number|null;proposalValue?:number|string|null;
  tags?:string|null;inFunnel?:boolean;createdAt?:string|null;
};

const labels:Record<string,string>={
  PROSPECCAO:"Prospecção",AGENDAMENTO:"Agendamento",NEGOCIACAO:"Negociação",
  VENDA_GANHA:"Venda ganha",VENDA_PERDIDA:"Venda perdida"
};
const columns=[
  {title:"ID",width:9},{title:"Empresa",width:42},{title:"CNPJ",width:22},
  {title:"Etapa comercial",width:21},{title:"Vendedor",width:28},
  {title:"Responsável",width:30},{title:"Telefone",width:21},
  {title:"E-mail",width:37},{title:"Endereço",width:50},
  {title:"Funcionários",width:17},{title:"Valor da proposta (R$)",width:25},
  {title:"Tags comerciais",width:38},{title:"Participa do funil",width:21},
  {title:"Data de cadastro",width:20}
] as const;
const encoder=new TextEncoder();
function escapeXml(value:unknown):string{
  return String(value??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
function columnLetter(index:number):string{
  let out="";for(let n=index+1;n>0;n=Math.floor((n-1)/26))out=String.fromCharCode(65+(n-1)%26)+out;
  return out;
}
function strCell(ref:string,value:unknown,style=0):string{
  return '<c r="'+ref+'" t="inlineStr"'+(style?' s="'+style+'"':'')+'><is><t xml:space="preserve">'+escapeXml(value)+'</t></is></c>';
}
function numCell(ref:string,value:number,style=0):string{
  return '<c r="'+ref+'"'+(style?' s="'+style+'"':'')+'><v>'+value+'</v></c>';
}
function dateInFortaleza(value?:string|null){
  if(!value)return "";
  const d=new Date(value);if(Number.isNaN(d.getTime()))return "";
  return d.toLocaleDateString("pt-BR",{timeZone:"America/Fortaleza"});
}
function makeSheet(rows:CompanyExportRow[]):string{
  const header='<row r="1" ht="29" customHeight="1">'+columns.map((col,i)=>strCell(columnLetter(i)+'1',col.title,1)).join("")+'</row>';
  const records=rows.map((company,i)=>{
    const r=i+2,cell=(j:number)=>columnLetter(j)+r,proposal=Number(company.proposalValue);
    const cells=[
      numCell(cell(0),Number(company.id)),strCell(cell(1),company.name),
      strCell(cell(2),company.cnpj||""),strCell(cell(3),labels[company.stage]||company.stage),
      strCell(cell(4),company.ownerName||"Sem responsável"),
      strCell(cell(5),company.responsible||""),strCell(cell(6),company.phone||""),
      strCell(cell(7),company.email||""),strCell(cell(8),company.address||""),
      company.employees==null?strCell(cell(9),""):numCell(cell(9),Number(company.employees)),
      company.proposalValue==null||company.proposalValue===""||!Number.isFinite(proposal)?strCell(cell(10),""):numCell(cell(10),proposal,2),
      strCell(cell(11),company.tags||""),
      strCell(cell(12),company.inFunnel?"Sim":"Não"),
      strCell(cell(13),dateInFortaleza(company.createdAt))
    ];
    return '<row r="'+r+'">'+cells.join("")+'</row>';
  }).join("");
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    +'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    +'<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    +'<sheetFormatPr defaultRowHeight="19"/>'
    +'<cols>'+columns.map((col,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+col.width+'" customWidth="1"/>').join("")+'</cols>'
    +'<sheetData>'+header+records+'</sheetData>'
    +'<autoFilter ref="A1:N'+Math.max(1,rows.length+1)+'"/></worksheet>';
}
const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  +'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
  +'<fonts count="2"><font><sz val="11"/><name val="Aptos"/></font>'
  +'<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font></fonts>'
  +'<fills count="3"><fill><patternFill patternType="none"/></fill>'
  +'<fill><patternFill patternType="gray125"/></fill>'
  +'<fill><patternFill patternType="solid"><fgColor rgb="FF10283D"/><bgColor indexed="64"/></patternFill></fill></fills>'
  +'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
  +'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
  +'<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
  +'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
  +'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
  +'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

const crcTable=new Uint32Array(256);
for(let n=0;n<256;n++){
  let c=n;
  for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);
  crcTable[n]=c>>>0;
}
function crc32(bytes:Uint8Array):number{
  let c=0xFFFFFFFF;
  for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);
  return(c^0xFFFFFFFF)>>>0;
}
function zipXlsx(entries:{name:string,content:string}[]):Blob{
  const parts:Uint8Array[]=[],directory:Uint8Array[]=[];
  let offset=0;
  for(const entry of entries){
    const name=encoder.encode(entry.name),data=encoder.encode(entry.content),crc=crc32(data);
    const local=new Uint8Array(30+name.length),view=new DataView(local.buffer);
    view.setUint32(0,0x04034b50,true);
    view.setUint16(4,20,true);view.setUint16(6,0x0800,true);
    view.setUint16(8,0,true);view.setUint32(14,crc,true);
    view.setUint32(18,data.length,true);view.setUint32(22,data.length,true);
    view.setUint16(26,name.length,true);local.set(name,30);
    parts.push(local,data);
    const central=new Uint8Array(46+name.length),cv=new DataView(central.buffer);
    cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);
    cv.setUint16(8,0x0800,true);cv.setUint16(10,0,true);
    cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);
    cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);central.set(name,46);
    directory.push(central);offset+=local.length+data.length;
  }
  const centralSize=directory.reduce((sum,x)=>sum+x.length,0);
  const end=new Uint8Array(22),v=new DataView(end.buffer);
  v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);
  v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
  return new Blob([...parts,...directory,end],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
export function makeCompaniesWorkbook(rows:CompanyExportRow[]):Blob{
  return zipXlsx([
    {name:"[Content_Types].xml",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>'},
    {name:"_rels/.rels",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>'},
    {name:"docProps/core.xml",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>Novos Negócios Odontoart</dc:creator><dc:title>Empresas do CRM</dc:title></cp:coreProperties>'},
    {name:"xl/workbook.xml",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Empresas" sheetId="1" r:id="rId1"/></sheets></workbook>'},
    {name:"xl/_rels/workbook.xml.rels",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:"xl/styles.xml",content:styles},
    {name:"xl/worksheets/sheet1.xml",content:makeSheet(rows)}
  ]);
}
export function downloadCompaniesXlsx(rows:CompanyExportRow[],filename:string):void{
  const blob=makeCompaniesWorkbook(rows),url=URL.createObjectURL(blob),link=document.createElement("a");
  link.href=url;link.download=filename.endsWith(".xlsx")?filename:filename+".xlsx";
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
