/**
 * Histórico comercial exportado em OOXML/XLSX real, sem dependências.
 * Uma empresa tem uma linha em Empresas e N linhas em cada aba histórica.
 * O ID da empresa é a chave de relacionamento entre todas as abas.
 * Textos usam inlineStr, nunca fórmulas (proteção contra injection em planilhas).
 */
export type CompanyExportRow={
 id:number;name:string;cnpj?:string|null;stage:string;ownerName?:string|null;
 responsible?:string|null;phone?:string|null;email?:string|null;address?:string|null;
 employees?:number|null;proposalValue?:number|string|null;tags?:string|null;
 inFunnel?:boolean;proposalAt?:string|null;negotiationDeadline?:string|null;
 wonAt?:string|null;lostAt?:string|null;createdAt?:string|null;
};
export type VisitExportRow={
 id:number;companyId:number;sellerId:number;sellerName:string;
 startsAt:string;endsAt:string;status:string;reason?:string|null;notes?:string|null;
 createdBy:number;createdByName:string;rescheduledToId?:number|null;
 createdAt:string;googleSync:boolean;
};
export type FollowupExportRow={
 id:number;companyId:number;sellerId:number;sellerName:string;type:string;
 notes:string;nextAt?:string|null;createdAt:string;googleSync:boolean;
};
export type AuditExportRow={
 id:number;companyId:number;actorId?:number|null;actorName:string;
 type:string;description:string;createdAt:string;
};
export type TagExportRow={
 id:number;companyId:number;tag:string;addedBy:number;addedByName:string;createdAt:string;
};
export type CompanyWorkbookData={
 items:CompanyExportRow[];visits:VisitExportRow[];followups:FollowupExportRow[];
 audit:AuditExportRow[];tagHistory:TagExportRow[];
};
const stages:Record<string,string>={
 PROSPECCAO:"Prospecção",AGENDAMENTO:"Agendamento",NEGOCIACAO:"Negociação",
 VENDA_GANHA:"Venda ganha",VENDA_PERDIDA:"Venda perdida"
};
const visitStates:Record<string,string>={
 AGENDADA:"Agendada",REALIZADA:"Realizada",REMARCADA:"Remarcada",
 NAO_RECEBEU:"Não recebeu",VENDA_GANHA:"Venda ganha",
 VENDA_PERDIDA:"Venda perdida",CANCELADA:"Cancelada"
};
type CellValue=string|number|boolean|null|undefined;
type DataRow=CellValue[];
type Tab={name:string;headers:string[];widths:number[];rows:DataRow[];numbers?:number[];money?:number[];dates?:number[]};
const safe=(s:CellValue)=>s===null||s===undefined?"":String(s);
const showStage=(s:string)=>stages[s]||s;
const showVisit=(s:string)=>visitStates[s]||s;
const yesNo=(b:boolean)=>b?"Sim":"Não";
const findName=(map:Map<number,string>,id:number)=>map.get(id)||"Empresa não encontrada";
function fortalezaDate(value?:string|null):number|null{
 if(!value)return null;
 const d=new Date(value);if(Number.isNaN(d.getTime()))return null;
 const f=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Fortaleza",
  year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
 const parts=f.formatToParts(d);const read=(k:string)=>Number(parts.find(p=>p.type===k)?.value||0);
 const y=read("year"),m=read("month"),day=read("day"),h=read("hour"),min=read("minute"),sec=read("second");
 return (Date.UTC(y,m-1,day,h,min,sec)-Date.UTC(1899,11,30))/86400000;
}
function sheetsOf(data:CompanyWorkbookData):Tab[]{
 const ids=new Map(data.items.map(c=>[c.id,c.name]));
 const companies:Tab={name:"Empresas",
  headers:["ID empresa","Empresa","CNPJ","Etapa atual","Vendedor atual","Responsável","Telefone","E-mail",
    "Endereço","Funcionários","Valor atual da proposta (R$)","Data da proposta",
    "Prazo da negociação","Data venda ganha","Data venda perdida","No funil","Tags comerciais","Data de cadastro"],
  widths:[13,43,22,21,28,27,19,33,48,17,27,23,23,22,22,15,40,22],
  numbers:[0,9],money:[10],dates:[11,12,13,14,17],
  rows:data.items.map(c=>[c.id,c.name,c.cnpj,showStage(c.stage),c.ownerName||"Sem responsável",
   c.responsible,c.phone,c.email,c.address,c.employees,c.proposalValue,
   fortalezaDate(c.proposalAt),fortalezaDate(c.negotiationDeadline),fortalezaDate(c.wonAt),
   fortalezaDate(c.lostAt),yesNo(!!c.inFunnel),c.tags,fortalezaDate(c.createdAt)])
 };
 const visitTab:Tab={name:"Visitas",
  headers:["ID empresa","Empresa","ID visita","Vendedor da visita","Início da visita","Fim da visita",
    "Resultado / Status","Motivo","Observações registradas","Reagendada para ID",
    "Registrada por","Criada em","Sincronizada no Google"],
  widths:[13,39,14,26,23,23,23,44,57,22,26,23,26],
  numbers:[0,2,9],dates:[4,5,11],
  rows:data.visits.map(v=>[v.companyId,findName(ids,v.companyId),v.id,v.sellerName,
   fortalezaDate(v.startsAt),fortalezaDate(v.endsAt),showVisit(v.status),v.reason,v.notes,
   v.rescheduledToId,v.createdByName,fortalezaDate(v.createdAt),yesNo(v.googleSync)])
 };
 const followupTab:Tab={name:"Acompanhamentos",
  headers:["ID empresa","Empresa","ID acompanhamento","Vendedor","Tipo de contato",
    "Observações e conversas","Próximo retorno","Registrado em","Retorno sincronizado"],
  widths:[13,40,22,28,19,65,24,24,26],numbers:[0,2],dates:[6,7],
  rows:data.followups.map(f=>[f.companyId,findName(ids,f.companyId),f.id,
   f.sellerName,f.type,f.notes,fortalezaDate(f.nextAt),fortalezaDate(f.createdAt),
   f.nextAt?yesNo(f.googleSync):"Sem data de retorno"])
 };
 const auditTab:Tab={name:"Historico Funil",
  headers:["ID empresa","Empresa","ID evento","Data / hora","Evento comercial",
    "Detalhes / observações / decisões","Registrado por"],
  widths:[13,42,13,24,29,83,29],numbers:[0,2],dates:[3],
  rows:data.audit.map(a=>[a.companyId,findName(ids,a.companyId),a.id,fortalezaDate(a.createdAt),
   a.type.replace(/_/g," "),a.description,a.actorName])
 };
 const tagTab:Tab={name:"Historico Tags",
  headers:["ID empresa","Empresa","ID atribuição","Tag / origem","Adicionada por","Adicionada em"],
  widths:[13,41,18,32,28,24],numbers:[0,2],dates:[5],
  rows:data.tagHistory.map(t=>[t.companyId,findName(ids,t.companyId),t.id,t.tag,
   t.addedByName,fortalezaDate(t.createdAt)])
 };
 const timeline:{at:string;kind:string;companyId:number;sourceId:number;status:string;detail:string;actor:string}[]=[];
 for(const a of data.audit)timeline.push({at:a.createdAt,kind:"Histórico comercial",companyId:a.companyId,sourceId:a.id,
  status:a.type.replace(/_/g," "),detail:a.description,actor:a.actorName});
 for(const v of data.visits)timeline.push({at:v.createdAt,kind:"Visita",companyId:v.companyId,sourceId:v.id,
  status:showVisit(v.status),detail:"Início: "+v.startsAt+" | Motivo: "+safe(v.reason)
   +" | Observações: "+safe(v.notes)+(v.rescheduledToId?" | Nova visita ID "+v.rescheduledToId:""),actor:v.sellerName});
 for(const f of data.followups)timeline.push({at:f.createdAt,kind:"Acompanhamento",companyId:f.companyId,sourceId:f.id,
  status:f.type,detail:f.notes+(f.nextAt?" | Próximo retorno: "+f.nextAt:""),actor:f.sellerName});
 for(const t of data.tagHistory)timeline.push({at:t.createdAt,kind:"Tag comercial",companyId:t.companyId,sourceId:t.id,
  status:t.tag,detail:"Tag adicionada à empresa",actor:t.addedByName});
 timeline.sort((a,b)=>a.companyId-b.companyId||Date.parse(a.at)-Date.parse(b.at)||a.kind.localeCompare(b.kind)||a.sourceId-b.sourceId);
 const timelineTab:Tab={name:"Linha do Tempo",
  headers:["ID empresa","Empresa","Quando","Origem","ID do registro","Status / tipo","Descrição completa","Vendedor / Autor"],
  widths:[13,41,24,25,18,29,91,31],numbers:[0,4],dates:[2],
  rows:timeline.map(e=>[e.companyId,findName(ids,e.companyId),fortalezaDate(e.at),
   e.kind,e.sourceId,e.status,e.detail,e.actor])
 };
 return [companies,visitTab,followupTab,auditTab,tagTab,timelineTab];
}
const enc=new TextEncoder();
function xml(value:CellValue):string{
 return safe(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"")
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}
function letter(index:number):string{
 let result="";for(let n=index+1;n>0;n=Math.floor((n-1)/26))result=String.fromCharCode(65+(n-1)%26)+result;
 return result;
}
function excelCell(ref:string,val:CellValue,col:number,tab:Tab):string{
 if(val===null||val===undefined||val==="")return "";
 const isMoney=tab.money?.includes(col);
 const isDate=tab.dates?.includes(col);
 const isNumeric=(tab.numbers?.includes(col)||isMoney||isDate)&&Number.isFinite(Number(val));
 if(isNumeric){
  const style=isMoney?2:isDate?3:0;
  return '<c r="'+ref+'"'+(style?' s="'+style+'"':'')+'><v>'+Number(val)+'</v></c>';
 }
 // Texto como inlineStr: não executar células iniciadas por sinais de fórmulas.
 return '<c r="'+ref+'" t="inlineStr"><is><t xml:space="preserve">'+xml(val)+'</t></is></c>';
}
function makeSheet(tab:Tab):string{
 if(tab.rows.length>1048575)throw new Error("A aba "+tab.name+" excede o limite de linhas do Excel.");
 const header='<row r="1" ht="29" customHeight="1">'+tab.headers.map((h,j)=>
  '<c r="'+letter(j)+'1" t="inlineStr" s="1"><is><t>'+xml(h)+'</t></is></c>').join("")+'</row>';
 const body=tab.rows.map((row,i)=>{
  const number=i+2;
  return '<row r="'+number+'">'+row.map((v,j)=>excelCell(letter(j)+number,v,j,tab)).join("")+'</row>';
 }).join("");
 const maxCol=letter(tab.headers.length-1),maxRow=Math.max(1,tab.rows.length+1);
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  +'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
  +'<dimension ref="A1:'+maxCol+maxRow+'"/>'
  +'<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
  +'<sheetFormatPr defaultRowHeight="19"/>'
  +'<cols>'+tab.widths.map((width,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+width+'" customWidth="1"/>').join("")+'</cols>'
  +'<sheetData>'+header+body+'</sheetData>'
  +'<autoFilter ref="A1:'+maxCol+maxRow+'"/></worksheet>';
}
const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
 +'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
 +'<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy hh:mm"/></numFmts>'
 +'<fonts count="2"><font><sz val="11"/><name val="Aptos"/></font>'
 +'<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font></fonts>'
 +'<fills count="3"><fill><patternFill patternType="none"/></fill>'
 +'<fill><patternFill patternType="gray125"/></fill>'
 +'<fill><patternFill patternType="solid"><fgColor rgb="FF10283D"/><bgColor indexed="64"/></patternFill></fill></fills>'
 +'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
 +'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
 +'<cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
 +'<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
 +'<xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
 +'<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
 +'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
const crcTable=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);crcTable[i]=c>>>0}
function crc(bytes:Uint8Array):number{
 let c=0xFFFFFFFF;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);
 return(c^0xFFFFFFFF)>>>0;
}
function zip(entries:{name:string;content:string}[]):Blob{
 const chunks:Uint8Array[]=[],directory:Uint8Array[]=[];let offset=0;
 for(const entry of entries){
  const name=enc.encode(entry.name),data=enc.encode(entry.content),checksum=crc(data);
  const head=new Uint8Array(30+name.length),h=new DataView(head.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);
  h.setUint32(14,checksum,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);
  h.setUint16(26,name.length,true);head.set(name,30);chunks.push(head,data);
  const cent=new Uint8Array(46+name.length),d=new DataView(cent.buffer);
  d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);
  d.setUint16(8,0x0800,true);d.setUint32(16,checksum,true);d.setUint32(20,data.length,true);
  d.setUint32(24,data.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);
  cent.set(name,46);directory.push(cent);offset+=head.length+data.length;
 }
 const directorySize=directory.reduce((n,part)=>n+part.length,0);
 const last=new Uint8Array(22),z=new DataView(last.buffer);
 z.setUint32(0,0x06054b50,true);z.setUint16(8,entries.length,true);z.setUint16(10,entries.length,true);
 z.setUint32(12,directorySize,true);z.setUint32(16,offset,true);
 // ArrayBuffer explícito: compatibilidade com BlobPart no TypeScript moderno.
 const buffers:ArrayBuffer[]=[];
 for(const part of [...chunks,...directory,last]){
  const buffer=new ArrayBuffer(part.byteLength);new Uint8Array(buffer).set(part);buffers.push(buffer);
 }
 return new Blob(buffers,{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}
export function makeCompaniesWorkbook(data:CompanyWorkbookData):Blob{
 const tabs=sheetsOf(data);
 const contentTypes='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  +'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
  +'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
  +'<Default Extension="xml" ContentType="application/xml"/>'
  +'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
  +'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
  +tabs.map((_,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join("")
  +'</Types>';
 const workbook='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  +'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
  +'<sheets>'+tabs.map((t,i)=>'<sheet name="'+xml(t.name)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join("")+'</sheets></workbook>';
 const relationships='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
  +'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
  +tabs.map((_,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join("")
  +'<Relationship Id="rId'+(tabs.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
  +'</Relationships>';
 const entries=[
  {name:"[Content_Types].xml",content:contentTypes},
  {name:"_rels/.rels",content:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
  {name:"xl/workbook.xml",content:workbook},
  {name:"xl/_rels/workbook.xml.rels",content:relationships},
  {name:"xl/styles.xml",content:styles},
  ...tabs.map((tab,i)=>({name:"xl/worksheets/sheet"+(i+1)+".xml",content:makeSheet(tab)}))
 ];
 return zip(entries);
}
export function downloadCompaniesXlsx(data:CompanyWorkbookData,filename:string):void{
 const url=URL.createObjectURL(makeCompaniesWorkbook(data)),link=document.createElement("a");
 link.href=url;link.download=filename.endsWith(".xlsx")?filename:filename+".xlsx";
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
