export const N=4;
export const OPTIONS=['L1','L2','R1','R2','T1','T2','B1','B2'];
export const makeRng=(seed)=>{let state=seed>>>0||1;return {next(){state^=state<<13;state^=state>>>17;state^=state<<5;state>>>=0;return state/4294967296},get state(){return state>>>0},set state(v){state=v>>>0||1}}};
export function fold(board,edge,depth){
 if(board.length!==16||!['L','R','T','B'].includes(edge)||![1,2].includes(depth))throw Error('Invalid fold');
 const next=board.slice();let merges=0,points=0,moves=0;const events=[];
 for(let outer=0;outer<depth;outer++)for(let cross=0;cross<4;cross++){
  const a=(edge==='L'||edge==='T')?outer:3-outer;
  const dest=depth===1?((edge==='L'||edge==='T')?1:2):3-a;
  let sr,sc,dr,dc;
  if(edge==='L'||edge==='R'){sr=cross;sc=a;dr=cross;dc=dest;}else{sr=a;sc=cross;dr=dest;dc=cross;}
  const si=sr*4+sc,di=dr*4+dc,v=board[si],target=board[di];
  if(!v)continue;
  if(!target){next[di]=v;next[si]=0;moves++;events.push({type:'move',from:si,to:di,value:v});}
  else if(target===v){next[di]=2*v;next[si]=0;merges++;moves++;points+=2*v;events.push({type:'merge',from:si,to:di,value:2*v,sourceValue:v});}
  else events.push({type:'block',from:si,to:di,value:v,targetValue:target});
 }
 return {board:next,valid:moves>0,merges,moves,points:merges>=3?points*2:points,events};
}
export const canMove=(board)=>OPTIONS.some(k=>fold(board,k[0],+k[1]).valid);
export function spawn(board,random=Math.random,avoid=[]){const next=board.slice();let free=next.map((x,i)=>x?-1:i).filter(i=>i!==-1);if(!free.length)return {board:next,index:-1,value:0};const preferred=free.filter(i=>!avoid.includes(i));if(preferred.length)free=preferred;const index=free[Math.min(free.length-1,Math.floor(random()*free.length))];const value=random()<.9?2:4;next[index]=value;return {board:next,index,value};}
export function start(random=Math.random){let b=Array(16).fill(0);for(const value of [2,2,4]){const free=b.map((x,i)=>x?-1:i).filter(i=>i!==-1);b[free[Math.min(free.length-1,Math.floor(random()*free.length))]]=value;}return b;}
export function turn(board,edge,depth,random=Math.random){const result=fold(board,edge,depth);if(!result.valid)return {...result,spawnIndex:-1,spawnValue:0,gameOver:!canMove(board)};const moved=result.events.filter(e=>e.type!=='block').map(e=>e.from);const r=spawn(result.board,random,moved);return {...result,board:r.board,spawnIndex:r.index,spawnValue:r.value,gameOver:!canMove(r.board)};}