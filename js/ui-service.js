export const $=(s,r=document)=>r.querySelector(s); export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
let toastTimer; export function toast(text,type='success'){const el=$('#toast'); el.textContent=text; el.className=`toast show ${type}`; clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.className='toast',2200);}
export function setMessage(text,type=''){const el=$('#message'); el.textContent=text; el.className=`message ${type}`;}
export function setProgress(v){$('#progressBar').value=v; $('#progressText').textContent=`${Math.round(v)}%`;}
export function confirmDiscard(){return confirm('変換済み画像を破棄して続行しますか？');}
