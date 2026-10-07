export function runVisibleAnimation(element: Element, draw: (now:number)=>void, {reducedMotion=false}:{reducedMotion?:boolean}={}) {
 let frame=0,visible=false,lastDraw=-Infinity,stopped=false;
 const interval=window.matchMedia('(pointer: coarse)').matches?1000/30:1000/60;
 const tick=(now:number)=>{frame=0;if(stopped||!visible||document.hidden)return;if(now-lastDraw>=interval-1){lastDraw=now;draw(now);}if(!reducedMotion)frame=requestAnimationFrame(tick);};
 const update=()=>{cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden&&!stopped)frame=requestAnimationFrame(tick);};
 const observer=new IntersectionObserver(([entry])=>{visible=Boolean(entry?.isIntersecting);update();});observer.observe(element);document.addEventListener('visibilitychange',update);
 return()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',update);};
}
