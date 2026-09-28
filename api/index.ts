import app from "../server/index.js";

export default function handler(req:any,res:any){
  const url=new URL(req.url||"/","http://localhost");
  const path=url.searchParams.get("__path")||"";
  url.searchParams.delete("__path");
  const query=url.searchParams.toString();
  req.url="/api/"+path+(query?"?"+query:"");
  return app(req,res);
}
