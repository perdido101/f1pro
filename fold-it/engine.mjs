export const N=4;
export const OPTIONS=['L1','L2','R1','R2','T1','T2','B1','B2'];
export function fold(board,edge,depth){
 const next=board.slice();let merges=0,points=0,moves=0;const events=[];
 for(let outer=0;outer<depth;outer++)for(let cross=0;cross<4;cross++){
   const a=(edge==='L'||edge==='T')?outer:3-outer;
   const dest=depth===1?((edge==='L'||edge==='T')?1:2):3-a;
   let sr,sc,dr,dc;
   if(edge==='L'||edge==='R'){sr=cross;sc=a;dr=cross;dc=dest;}else{sr=a;sc=cross;dr=dest;dc=cross;}
   const si=sr*4+sc,di=dr*4+dc,v=board[si];if(!v)continue;
   if(next[di]===0){next[di]=v;next[si]=0;moves++;events.push({type:'move',from:si,to:di,value:v});}
   else if(next[di]===v){next[di]=v*2;next[si]=0;merges++;moves++;points+=v*2;events.push({type:'merge',from:si,to:di,value:v*2});}
 }
 return {board:next,valid:moves>0,merges,moves,points:merges>=3?points*2:points,events};
}
export function canMove(board){return OPTIONS.some(k=>fold(board,k[0],+k[1]).valid)}
export function spawn(board,random=Math.random){const next=board.slice(),free=[];for(let i=0;i<16;i++)if(!next[i])free.push(i);if(!free.length)return {board:next,index:-1};const index=free[Math.min(free.length-1,Math.floor(random()*free.length))];next[index]=random()<.9?2:4;return {board:next,index};}
export function start(random=Math.random){let b=Array(16).fill(0);b=spawn(b,random).board;b=spawn(b,random).board;return b;}
export function turn(board,edge,depth,random=Math.random){const result=fold(board,edge,depth);if(!result.valid)return {...result,spawnIndex:-1,gameOver:!canMove(board)};const r=spawn(result.board,random);return {...result,board:r.board,spawnIndex:r.index,gameOver:!canMove(r.board)};}