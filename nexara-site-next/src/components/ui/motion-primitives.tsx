'use client';
// Adapted from Julien Thibeaut's MIT Motion Primitives, published on 21st.dev.
// See THIRD_PARTY_NOTICES.md for source URLs and the full license.
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
function useFineMotion() {
 const reduced = useReducedMotion();
 const [fine, setFine] = useState(false);
 useEffect(() => { const query=window.matchMedia('(hover: hover) and (pointer: fine)'); const update=()=>setFine(query.matches); update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update); }, []);
 return fine && !reduced;
}
type TiltProps = HTMLMotionProps<'div'> & {as?:'div'|'article'|'button';type?:'button';rotationFactor?:number};
export function Tilt({as='div',children,className='',style,rotationFactor=5,onMouseMove,onMouseLeave,...props}: TiltProps) {
 const ref=useRef<HTMLDivElement>(null); const enabled=useFineMotion();
 const x=useMotionValue(0),y=useMotionValue(0);
 const xs=useSpring(x,{stiffness:180,damping:24}),ys=useSpring(y,{stiffness:180,damping:24});
 const rotateX=useTransform(ys,[-.5,.5],[rotationFactor,-rotationFactor]);
 const rotateY=useTransform(xs,[-.5,.5],[-rotationFactor,rotationFactor]);
 const Element=motion[as] as typeof motion.div;
 useEffect(()=>{if(!enabled){x.set(0);y.set(0);}},[enabled,x,y]);
 return <Element ref={ref} className={`depth-card ${className}`} {...props} style={{...style,transformPerspective:1000,...(enabled?{rotateX,rotateY}:{})}}
 onMouseMove={event=>{if(enabled&&ref.current){const rect=ref.current.getBoundingClientRect();x.set((event.clientX-rect.left)/rect.width-.5);y.set((event.clientY-rect.top)/rect.height-.5);ref.current.style.setProperty('--light-x',`${event.clientX-rect.left}px`);ref.current.style.setProperty('--light-y',`${event.clientY-rect.top}px`);}onMouseMove?.(event);}}
 onMouseLeave={event=>{x.set(0);y.set(0);onMouseLeave?.(event);}}>{children}</Element>;
}
export function Spotlight({size=600,className=''}:{size?:number;className?:string}) {
 const ref=useRef<HTMLDivElement>(null);const [hovered,setHovered]=useState(false);const enabled=useFineMotion();
 const x=useSpring(0,{stiffness:100,damping:25}),y=useSpring(0,{stiffness:100,damping:25});
 const left=useTransform(x,v=>v-size/2),top=useTransform(y,v=>v-size/2);
 useEffect(()=>{const parent=ref.current?.closest<HTMLElement>('[data-hero-surface]');if(!enabled||!parent)return;
 const controller=new AbortController();
 const move=(event:PointerEvent)=>{const rect=parent.getBoundingClientRect();x.set(event.clientX-rect.left);y.set(event.clientY-rect.top);};
 parent.addEventListener('pointermove',move,{signal:controller.signal,passive:true});
 parent.addEventListener('pointerenter',()=>setHovered(true),{signal:controller.signal});parent.addEventListener('pointerleave',()=>setHovered(false),{signal:controller.signal});return()=>controller.abort();
 },[enabled,x,y]);
 return <motion.div ref={ref} aria-hidden="true" className={`hero-spotlight ${className}`} style={{width:size,height:size,left,top,opacity:enabled&&hovered?1:0}}/>;
}
export function HeroLighting(){return <div className="hero-lighting" aria-hidden="true"><div className="hero-lighting__wash"/><div className="hero-lighting__lens"/><Spotlight/></div>;}
