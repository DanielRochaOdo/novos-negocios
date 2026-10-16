import { strict as assert } from "node:assert";
import { test } from "node:test";
import { makeCompaniesWorkbook, type CompanyWorkbookData } from "../client/src/companies-xlsx";

function xmlEntries(bytes:Uint8Array):Map<string,string>{
 const entries=new Map<string,string>();
 const decoder=new TextDecoder();const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 let p=0;
 while(p+30<bytes.byteLength&&view.getUint32(p,true)===0x04034b50){
  const nameSize=view.getUint16(p+26,true),extra=view.getUint16(p+28,true);
  const dataSize=view.getUint32(p+18,true),method=view.getUint16(p+8,true);
  assert.equal(method,0,"ZIP deve armazenar XML sem compressão");
  const name=decoder.decode(bytes.slice(p+30,p+30+nameSize));
  const start=p+30+nameSize+extra;
  entries.set(name,decoder.decode(bytes.slice(start,start+dataSize)));
  p=start+dataSize;
 }
 return entries;
}
const sample:CompanyWorkbookData={
 items:[{id:12,name:"Clínica A & B",stage:"NEGOCIACAO",ownerName:"Junior Queiroz",
   phone:"(85) 90000-0000",cnpj:"00123456000199",proposalValue:"1599.99",inFunnel:true,
   proposalAt:"2026-10-15T17:00:00.000Z",createdAt:"2026-10-10T11:00:00.000Z"}],
 visits:[{id:8,companyId:12,sellerId:4,sellerName:"Junior Queiroz",startsAt:"2026-10-15T17:00:00.000Z",
  endsAt:"2026-10-15T18:30:00.000Z",status:"REMARCADA",reason:"Paciente não recebeu",
  notes:"Observação <especial> & teste",createdBy:4,createdByName:"Junior Queiroz",
  rescheduledToId:9,googleSync:true,createdAt:"2026-10-10T11:00:00.000Z"}],
 followups:[{id:21,companyId:12,sellerId:4,sellerName:"Junior Queiroz",
  type:"WhatsApp",notes:"Contato =HYPERLINK(\"site\")",nextAt:"2026-10-20T17:00:00.000Z",
  googleSync:false,createdAt:"2026-10-16T17:00:00.000Z"}],
 audit:[{id:50,companyId:12,actorId:4,actorName:"Junior Queiroz",
  type:"PROPOSTA_ENTREGUE",description:"Proposta apresentada, valor R$ 1.599,99",
  createdAt:"2026-10-15T17:00:00.000Z"}],
 tagHistory:[{id:11,companyId:12,tag:"Indicação",addedBy:4,addedByName:"Junior Queiroz",
  createdAt:"2026-10-10T11:00:00.000Z"}]
};
test("XLSX inclui seis abas conectadas pelo ID, com dados completos do ciclo",async()=>{
 const workbook=makeCompaniesWorkbook(sample);
 assert.equal(workbook.type,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
 const buffer=await workbook.arrayBuffer(),bytes=new Uint8Array(buffer);
 const entries=xmlEntries(bytes);
 assert.equal(entries.size,11);
 assert.ok(entries.get("xl/workbook.xml")?.includes('name="Linha do Tempo"'));
 assert.ok(entries.get("xl/workbook.xml")?.includes('name="Historico Funil"'));
 for(let i=1;i<=6;i++){
  const sheet=entries.get("xl/worksheets/sheet"+i+".xml");
  assert.ok(sheet,"sheet "+i+" ausente");
  assert.ok(sheet.includes('<autoFilter ref="'),"filtro do Excel ausente");
  assert.ok(sheet.includes('r="A2"'),"referência de ID empresa ausente");
 }
 assert.ok(entries.get("xl/worksheets/sheet1.xml")?.includes("00123456000199"),"CNPJ deve ser texto");
 assert.ok(entries.get("xl/worksheets/sheet2.xml")?.includes("Paciente não recebeu"));
 assert.ok(entries.get("xl/worksheets/sheet2.xml")?.includes("Observação &lt;especial&gt; &amp; teste"));
 assert.ok(entries.get("xl/worksheets/sheet3.xml")?.includes('t="inlineStr"'),"contato não pode virar fórmula");
 assert.ok(entries.get("xl/worksheets/sheet3.xml")?.includes('=HYPERLINK'),"observação deve ser preservada como texto");
 assert.ok(entries.get("xl/worksheets/sheet4.xml")?.includes("Proposta apresentada"));
 assert.ok(entries.get("xl/worksheets/sheet5.xml")?.includes("Indicação"));
 const timeline=entries.get("xl/worksheets/sheet6.xml")||"";
 assert.ok(timeline.includes("WhatsApp")&&timeline.includes("Visita (criação)")&&timeline.includes("Indicação"));
});
test("Planilha sem histórico ainda exporta os cabeçalhos das seis abas",async()=>{
 const blank:CompanyWorkbookData={items:sample.items,visits:[],followups:[],audit:[],tagHistory:[]};
 const entries=xmlEntries(new Uint8Array(await makeCompaniesWorkbook(blank).arrayBuffer()));
 assert.ok(entries.get("xl/worksheets/sheet2.xml")?.includes('<autoFilter ref="A1:M1"/>'));
 assert.ok(entries.get("xl/worksheets/sheet6.xml")?.includes('<autoFilter ref="A1:H1"/>'));
});
