"use strict";
const buttons=[...document.querySelectorAll("[data-tab]")];
const panels=[...document.querySelectorAll("[data-panel]")];
function show(name){if(!panels.some(p=>p.dataset.panel===name))return;panels.forEach(p=>p.hidden=p.dataset.panel!==name);buttons.forEach(b=>{const active=b.dataset.tab===name;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});window.scrollTo({top:0,behavior:"smooth"});}
buttons.forEach(b=>b.addEventListener("click",()=>show(b.dataset.tab)));
document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.jump)));
const responses={Heavy:"You can carry a lot and still deserve a quiet moment.",Hopeful:"Keep the hope. Small repairs count.",Worried:"Your care matters. One calm conversation is a place to begin.",Okay:"Okay is a valid place to start."};
document.querySelectorAll("[data-mood]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mood]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");document.getElementById("mood-feedback").textContent=responses[b.dataset.mood]+" This check-in is not stored."; }));
const reflection=document.getElementById("reflection"),status=document.getElementById("pages-status");
document.getElementById("clear-reflection").addEventListener("click",()=>{reflection.value="";status.textContent="Page cleared. Nothing was saved or sent.";reflection.focus();});
document.getElementById("copy-reflection").addEventListener("click",async()=>{if(!reflection.value.trim()){status.textContent="Write something first.";return;}try{await navigator.clipboard.writeText(reflection.value);status.textContent="Copied to your clipboard. This site has not saved or sent your words.";}catch(_){reflection.select();status.textContent="Clipboard permission unavailable. Select and copy the text yourself."; }});
const coach={repair:"Try: ‘I care about us more than winning that argument. Can we try again when we’re both ready?’",listen:"Try: ‘You don’t have to explain everything. I can listen without trying to fix it right away.’",boundary:"Try: ‘This boundary matters, and so do your feelings about it. We can talk about both.’"};
document.querySelectorAll("[data-coach]").forEach(b=>b.addEventListener("click",()=>{document.getElementById("coach-output").textContent=coach[b.dataset.coach]}));