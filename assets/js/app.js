(function(){
"use strict";
var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var hasG = typeof window.gsap !== "undefined";
var fmtRub = function(n){ return n.toLocaleString("ru-RU").replace(/[\u00a0\u202f]/g," ") + " ₽"; };
var $ = function(s,el){ return (el||document).querySelector(s); };
var $$ = function(s,el){ return Array.prototype.slice.call((el||document).querySelectorAll(s)); };

/* ---------- DATA (from startlinguas.tilda.ws) ---------- */
var FMT_LABEL = {solo:"Один на один", pair:"В паре", group:"В группе 3–4"};
var COURSES = [
 {id:"fast", code:"FST", name:"Fast", title:"Ускоренный разговорный английский", lang:"en", aud:["adults"], goals:["speak"], pop:1, color:"#2747E8",
  desc:"Ускоренный базовый разговорный английский для взрослых. Курс рассчитан на начальный уровень: за 6 месяцев вы с нуля дойдёте до уровня A2 и заговорите.",
  tags:["С нуля","До A2","6 модулей"], per:8,
  formats:{solo:{lesson:2000,month:16000,min:55}, pair:{lesson:1750,month:12000,min:60}, group:{lesson:1350,month:10800,min:60}},
  incl:["6 модулей, каждый рассчитан на месяц","1 модуль: 4 недели, 8 занятий","С нуля до уровня A2 за 6 месяцев","Разговорный уровень языка","Сертификат по окончании"]},
 {id:"big", code:"BIG", name:"Big", title:"Общий английский для взрослых", lang:"en", aud:["adults"], goals:["general"], pop:2, color:"#1B2A6B",
  desc:"Системный курс общего английского: грамматика, лексика, аудирование и разговор. Один уровень рассчитан на 6 месяцев.",
  tags:["Общий английский","1 уровень = 6 мес."], per:8,
  formats:{solo:{lesson:2000,month:16000,min:55}, pair:{lesson:1750,month:12000,min:60}, group:{lesson:1350,month:10800,min:60}},
  incl:["Курс по общему английскому","Один уровень за 6 месяцев","8 занятий в месяц","Все материалы на доске Miro"]},
 {id:"kids", code:"KDS", name:"Kids", title:"Английский для детей 5–10 лет", lang:"en", aud:["kids"], goals:["speak","general"], pop:3, color:"#E39A17",
  desc:"Индивидуальные уроки по 40 минут. Разговариваем и читаем, слушаем и поём песни, смотрим мультфильмы и рисуем. Можно заниматься с планшета.",
  tags:["5–10 лет","40 минут","Песни и мультики"], per:8,
  formats:{solo:{lesson:1500,month:12000,min:40}},
  incl:["Индивидуальные уроки по 40 минут","Разговор, чтение, песни, мультфильмы и рисование","Можно заниматься через планшет","8 уроков в месяц"]},
 {id:"teen", code:"TNG", name:"Teenager", title:"Английский для подростков 11–15 лет", lang:"en", aud:["teens"], goals:["general","speak"], pop:4, color:"#0F7C8C",
  desc:"Английский для подростков: индивидуально по 50 минут, в паре или в группе из 3–4 человек.",
  tags:["11–15 лет","50 минут","3 формата"], per:8,
  formats:{solo:{lesson:1750,month:14000,min:50}, pair:{lesson:1500,month:12000,min:60}, group:{lesson:1250,month:10000,min:60}},
  incl:["Индивидуально, в паре или группе","8 занятий в месяц","Личный чат с преподавателем в Telegram"]},
 {id:"salut", code:"SLT", name:"Salut", title:"Французский язык", lang:"fr", aud:["adults"], goals:["speak","general"], pop:5, color:"#C2414F",
  desc:"Французский с нуля: много работы над произношением и знакомство с культурой Франции. Ведёт Басира, обладательница сертификатов DALF и DELF.",
  tags:["С нуля","Произношение","Культура Франции"], per:8,
  formats:{solo:{lesson:1500,month:10000,min:55}},
  incl:["Индивидуальные уроки по 55 минут","Постановка произношения","Культура Франции","8 уроков в месяц"]},
 {id:"doctor", code:"DOC", name:"Doctor", title:"Английский для медиков", lang:"en", aud:["adults"], goals:["work"], pop:6, color:"#0E8A6A",
  desc:"Медицинский английский для врачей, студентов и абитуриентов: темы из сферы медицины по британским учебникам.",
  tags:["Медицина","Британские учебники"], per:8,
  formats:{solo:{lesson:2000,month:16000,min:55}},
  incl:["Индивидуальные уроки по 55 минут","Медицинская лексика и темы","Британские учебники","8 уроков в месяц"]},
 {id:"reading", code:"HRD", name:"Happy Reading", title:"Книжный клуб на английском", lang:"en", aud:["adults","teens"], goals:["read"], pop:7, color:"#8A5A2B",
  desc:"Курс по чтению на английском в формате книжного клуба: читаем и обсуждаем книги в группе.",
  tags:["Книжный клуб","Группа","4 встречи"], per:4,
  formats:{group:{lesson:500,month:2000,min:60}},
  incl:["Встречи по 60 минут","4 занятия в месяц","Обсуждение книг в группе"]},
 {id:"trial", code:"TRL", name:"Пробный урок", title:"Пробное занятие-консультация", lang:"any", aud:["adults","kids","teens","teachers"], goals:["start"], pop:0, color:"#E3473A",
  desc:"30 минут, чтобы познакомиться с преподавателем, определить ваш уровень и подобрать курс и формат.",
  tags:["30 минут","Определим уровень"], per:1,
  formats:{solo:{lesson:500,min:30}},
  incl:["Знакомство с преподавателем","Определение уровня","Рекомендация курса и формата"]},
 {id:"abroad", code:"ABR", name:"Учёба за рубежом", title:"Консультация по поступлению за границу", lang:"any", aud:["adults","teens"], goals:["abroad"], pop:8, color:"#23305F",
  desc:"Консультация по учёбе за границей: языковые курсы, стипендии, гранты, университеты в США, Азии и Европе. Басира сама прошла путь стипендиата Фулбрайт.",
  tags:["США","Азия","Европа","Гранты"], per:1,
  formats:{solo:{lesson:2000,min:60}},
  incl:["60 минут","Языковые курсы, стипендии, гранты","Подбор университетов: США, Азия, Европа"]},
 {id:"teacher", code:"TCH", name:"Онлайн тичинг", title:"Курс для преподавателей", lang:"any", aud:["teachers"], goals:["work"], pop:9, color:"#5B6B2E",
  desc:"Курс для преподавателей, которые хотят вести уроки онлайн: опыт школы, которая 7 лет учит студентов по всему миру.",
  tags:["Для преподавателей","1 месяц"], per:0,
  formats:{solo:{month:10000}},
  incl:["1 месяц обучения","Инструменты онлайн-урока: Zoom, Miro, Telegram, Google"]}
];
var FILTERS = {
  aud:[["all","Все"],["adults","Взрослым"],["kids","Детям 5–10"],["teens","Подросткам 11–15"],["teachers","Преподавателям"]],
  lang:[["all","Все"],["en","English"],["fr","Français"]],
  goal:[["all","Любая"],["speak","Заговорить"],["general","Общий уровень"],["work","Для профессии"],["read","Чтение"],["abroad","Учёба за рубежом"],["start","Первый шаг"]],
  fmt:[["any","Любой"],["solo","Один на один"],["pair","В паре"],["group","В группе"]]
};
var state = {aud:"all",lang:"all",goal:"all",fmt:"any",budget:16000,q:"",sort:"pop"};
try{ var saved = JSON.parse(localStorage.getItem("sl-filters")||"null"); if(saved) for(var k in saved) if(k in state) state[k]=saved[k]; }catch(e){}

function priceOf(f){ return f.month || f.lesson; }
function minPrice(c, fmt){
  if(fmt && fmt!=="any" && c.formats[fmt]) return priceOf(c.formats[fmt]);
  var m = Infinity; for(var k in c.formats) m = Math.min(m, priceOf(c.formats[k])); return m;
}
function priceLine(c, fmt){
  var key = (fmt && fmt!=="any" && c.formats[fmt]) ? fmt : null;
  var keys = Object.keys(c.formats);
  var f = key ? c.formats[key] : c.formats[keys.reduce(function(a,b){ return priceOf(c.formats[a])<=priceOf(c.formats[b])?a:b; })];
  var multi = !key && keys.length>1;
  if(f.month) return {big:(multi?"от ":"")+fmtRub(f.month), small:c.per===4?"в месяц · 4 занятия":(c.per?"в месяц · "+c.per+" уроков":"за месяц обучения")};
  return {big:fmtRub(f.lesson), small:"за "+f.min+" минут"};
}

/* ---------- CATALOG ---------- */
var grid = $("#grid");
function buildChips(){
  $$("[data-filter]").forEach(function(box){
    var key = box.getAttribute("data-filter");
    box.innerHTML = FILTERS[key].map(function(o){ return '<button type="button" class="chip" data-v="'+o[0]+'" aria-pressed="'+(state[key]===o[0])+'">'+o[1]+'</button>'; }).join("");
    box.addEventListener("click", function(e){
      var b = e.target.closest(".chip"); if(!b) return;
      state[key] = b.getAttribute("data-v");
      $$(".chip",box).forEach(function(x){ x.setAttribute("aria-pressed", String(x===b)); });
      render();
    });
  });
}
function matches(c){
  if(state.aud!=="all" && c.aud.indexOf(state.aud)<0) return false;
  if(state.lang!=="all" && c.lang!==state.lang && c.lang!=="any") return false;
  if(state.goal!=="all" && c.goals.indexOf(state.goal)<0) return false;
  if(state.fmt!=="any" && !c.formats[state.fmt]) return false;
  if(minPrice(c,state.fmt) > state.budget) return false;
  if(state.q){
    var hay = (c.name+" "+c.title+" "+c.desc+" "+c.tags.join(" ")+" "+(c.lang==="fr"?"французский french":c.lang==="en"?"английский english":"")).toLowerCase();
    var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    for(var i=0;i<words.length;i++) if(hay.indexOf(words[i])<0) return false;
  }
  return true;
}
function plural(n){ var a=n%10,b=n%100; if(a===1&&b!==11) return "программа"; if(a>=2&&a<=4&&(b<10||b>=20)) return "программы"; return "программ"; }
function render(){
  try{ localStorage.setItem("sl-filters", JSON.stringify(state)); }catch(e){}
  var list = COURSES.filter(matches);
  list.sort(function(a,b){
    if(state.sort==="asc") return minPrice(a,state.fmt)-minPrice(b,state.fmt);
    if(state.sort==="desc") return minPrice(b,state.fmt)-minPrice(a,state.fmt);
    return a.pop-b.pop;
  });
  $("#count").textContent = list.length+" "+plural(list.length);
  if(!list.length){
    grid.innerHTML = '<div class="empty"><b>Под эти условия курса нет</b>Попробуйте увеличить бюджет или выбрать другой формат. Либо начните с пробного урока за 500 ₽, и мы подберём программу лично.</div>';
    return;
  }
  grid.innerHTML = list.map(function(c){
    var p = priceLine(c,state.fmt);
    return '<button type="button" class="ticket" style="--tc:'+c.color+'" data-id="'+c.id+'" aria-label="'+c.name+': '+c.title+', '+p.big+'">'+
      '<div class="t-head"><span class="t-code">'+c.code+'</span><span class="mono">'+(c.lang==="fr"?"FR":c.lang==="en"?"EN":"SL")+' · '+Object.keys(c.formats).map(function(k){return FMT_LABEL[k].split(" ")[0]==="Один"?"1:1":k==="pair"?"2":"3–4";}).join(" / ")+'</span></div>'+
      '<div class="t-body"><h3>'+c.name+'</h3><p>'+c.title+'</p><div class="tags">'+c.tags.map(function(t){return '<span class="tag">'+t+'</span>';}).join("")+'</div></div>'+
      '<div class="t-foot"><div class="t-price"><b>'+p.big+'</b><span>'+p.small+'</span></div><span class="t-go">Подробнее →</span></div></button>';
  }).join("");
  if(hasG && !RM){ gsap.fromTo(".ticket",{y:28,rotation:-1.5},{y:0,rotation:0,duration:.6,stagger:.05,ease:"power3.out",clearProps:"transform"}); }
}
buildChips();
var budget = $("#budget"), bOut = $("#budgetOut");
budget.value = state.budget; bOut.textContent = fmtRub(+budget.value);
budget.addEventListener("input", function(){ state.budget = +budget.value; bOut.textContent = fmtRub(state.budget); render(); });
var qIn = $("#q"); qIn.value = state.q;
qIn.addEventListener("input", function(){ state.q = qIn.value.trim(); render(); });
var sortSel = $("#sort"); sortSel.value = state.sort;
sortSel.addEventListener("change", function(){ state.sort = sortSel.value; render(); });
$("#reset").addEventListener("click", function(){
  state = {aud:"all",lang:"all",goal:"all",fmt:"any",budget:16000,q:"",sort:state.sort};
  budget.value=16000; bOut.textContent=fmtRub(16000); qIn.value="";
  $$("[data-filter]").forEach(function(box){ var k=box.getAttribute("data-filter"); $$(".chip",box).forEach(function(x){ x.setAttribute("aria-pressed", String(x.getAttribute("data-v")===state[k])); }); });
  render();
});
var fToggle = $("#fToggle"), filtersEl = $("#filters");
fToggle.addEventListener("click", function(){ var o = filtersEl.classList.toggle("open"); fToggle.setAttribute("aria-expanded", String(o)); fToggle.textContent = o?"Скрыть фильтры":"Фильтры"; });
grid.addEventListener("click", function(e){ var t = e.target.closest(".ticket"); if(t) openCourse(t.getAttribute("data-id"), state.fmt); });
render();

/* ---------- COURSE SHEET ---------- */
var sheet = $("#sheet"), sheetIn = $("#sheetIn");
function byId(id){ for(var i=0;i<COURSES.length;i++) if(COURSES[i].id===id) return COURSES[i]; return null; }
function openCourse(id, fmt){
  var c = byId(id); if(!c) return;
  var keys = Object.keys(c.formats);
  var sel = (fmt && c.formats[fmt]) ? fmt : keys[0];
  function msg(){ return "Здравствуйте! Хочу записаться: «"+c.name+"» ("+c.title.toLowerCase()+")"+(keys.length>1?", формат: "+FMT_LABEL[sel].toLowerCase():"")+". Подскажите, пожалуйста, ближайшее время для пробного урока."; }
  sheetIn.innerHTML =
    '<div class="sheet-head" style="--tc:'+c.color+'"><div><span class="mono">'+c.code+' · '+(c.lang==="fr"?"Français":c.lang==="en"?"English":"Start Linguas")+'</span><h3 id="sheetTitle">'+c.name+'</h3><p style="opacity:.9;margin-top:4px">'+c.title+'</p></div><button class="sheet-close" type="button" aria-label="Закрыть">×</button></div>'+
    '<div class="sheet-body"><p>'+c.desc+'</p>'+
    '<div><p class="mono" style="color:var(--muted);margin-bottom:10px">Стоимость</p><div class="fmt-table">'+keys.map(function(k){
      var f=c.formats[k], save = (f.month && f.lesson && c.per>1) ? f.lesson*c.per - f.month : 0;
      return '<div class="fmt"><span class="mono">'+(keys.length>1||k!=="solo"?FMT_LABEL[k]:"Формат")+(f.min?" · "+f.min+" мин":"")+'</span>'+
        (f.month?'<b>'+fmtRub(f.month)+'</b><small>'+(c.per?"в месяц, "+c.per+" "+(c.per===4?"занятия":"уроков"):"месяц обучения")+'</small>':'<b>'+fmtRub(f.lesson)+'</b><small>за занятие</small>')+
        (f.month&&f.lesson?'<small>разовое занятие: '+fmtRub(f.lesson)+'</small>':'')+
        (save>0?'<span class="save">Выгода '+fmtRub(save)+' при оплате месяца</span>':'')+'</div>';
    }).join("")+'</div></div>'+
    '<div><p class="mono" style="color:var(--muted);margin-bottom:10px">Что входит</p><ul class="incl">'+c.incl.map(function(i){return '<li>'+i+'</li>';}).join("")+'</ul></div>'+
    (keys.length>1?'<div><p class="mono" style="color:var(--muted);margin-bottom:10px">Ваш формат</p><div class="fmt-tabs chips">'+keys.map(function(k){return '<button type="button" class="chip" data-f="'+k+'" aria-pressed="'+(k===sel)+'">'+FMT_LABEL[k]+'</button>';}).join("")+'</div></div>':'')+
    '<div class="msg-box"><label class="mono" for="msgText" style="color:var(--muted)">Сообщение для записи</label><textarea id="msgText">'+msg()+'</textarea>'+
    '<div class="q-actions"><a class="btn-solid" id="tgGo" href="https://t.me/Start_Linguas" target="_blank" rel="noopener">Скопировать и открыть Telegram ↗</a><button type="button" class="btn-line" id="msgCopy">Только скопировать</button></div>'+
    '<p style="font-size:13px;color:var(--muted)">Telegram: @Start_Linguas. Вставьте сообщение в чат, и мы ответим.</p></div></div>';
  var ta = $("#msgText", sheetIn);
  $$(".fmt-tabs .chip", sheetIn).forEach(function(b){ b.addEventListener("click", function(){
    sel = b.getAttribute("data-f"); $$(".fmt-tabs .chip", sheetIn).forEach(function(x){ x.setAttribute("aria-pressed", String(x===b)); }); ta.value = msg();
  }); });
  $("#tgGo", sheetIn).addEventListener("click", function(){ copyText(ta.value, ta, "Сообщение скопировано, вставьте его в чат"); });
  $("#msgCopy", sheetIn).addEventListener("click", function(){ copyText(ta.value, ta, "Сообщение скопировано"); });
  $(".sheet-close", sheetIn).addEventListener("click", closeSheet);
  if(typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open","");
  if(window.__lenis) window.__lenis.stop();
  if(hasG && !RM) gsap.fromTo(sheetIn,{y:40,scale:.97},{y:0,scale:1,duration:.45,ease:"power3.out"});
}
function closeSheet(){ if(sheet.open){ sheet.close ? sheet.close() : sheet.removeAttribute("open"); } }
sheet.addEventListener("close", function(){ if(window.__lenis) window.__lenis.start(); });
sheet.addEventListener("click", function(e){ if(e.target===sheet) closeSheet(); });
$$("[data-open]").forEach(function(a){ a.addEventListener("click", function(e){ e.preventDefault(); openCourse(a.getAttribute("data-open")); }); });

var toast = $("#toast"), toastT;
function showToast(t){ toast.textContent=t; toast.hidden=false; clearTimeout(toastT); toastT=setTimeout(function(){ toast.hidden=true; },2600); }
function copyText(text, selectEl, okMsg){
  var fallback = function(){ if(selectEl && selectEl.select){ selectEl.focus(); selectEl.select(); } showToast("Текст выделен, скопируйте его вручную"); };
  try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){ showToast(okMsg); }, fallback); } else fallback(); }catch(e){ fallback(); }
}

/* ---------- QUIZ ---------- */
var qcard = $("#qcard"), ans = {}, hist = [];
var Q = {
  who:{t:"Кто будет учиться?", o:[["adult","Я, взрослый"],["kid","Ребёнок 5–10 лет"],["teen","Подросток 11–15 лет"],["teacher","Я преподаватель"]]},
  lang:{t:"Какой язык вам нужен?", o:[["en","Английский"],["fr","Французский"]]},
  goal:{t:"Какая у вас цель?", o:[["speak","Быстро заговорить с нуля"],["general","Системно поднять уровень"],["work","Английский для медицины"],["read","Читать книги в оригинале"],["abroad","Поступить на учёбу за границу"]]},
  tgoal:{t:"Что важнее для подростка?", o:[["general","Школьная программа и уровень"],["read","Полюбить чтение на английском"],["abroad","Поступление за границу в будущем"]]},
  fmt:{t:"В каком формате удобнее?", o:[["solo","Один на один с преподавателем"],["pair","В паре с другом или коллегой"],["group","В мини-группе 3–4 человека"],["any","Пока не знаю, покажите самый выгодный"]]}
};
function courseFromAns(){
  if(ans.who==="kid") return "kids";
  if(ans.who==="teacher") return "teacher";
  if(ans.who==="teen") return ans.tgoal==="read"?"reading":ans.tgoal==="abroad"?"abroad":"teen";
  if(ans.lang==="fr") return "salut";
  return {speak:"fast",general:"big",work:"doctor",read:"reading",abroad:"abroad"}[ans.goal];
}
function nextKey(){
  if(!ans.who) return "who";
  if(ans.who==="adult" && !ans.lang) return "lang";
  if(ans.who==="adult" && ans.lang==="en" && !ans.goal) return "goal";
  if(ans.who==="teen" && !ans.tgoal) return "tgoal";
  var c = byId(courseFromAns());
  if(c && Object.keys(c.formats).length>1 && !ans.fmt) return "fmt";
  return null;
}
function totalSteps(){ return ans.who==="adult" ? (ans.lang==="fr"?2:4) : ans.who==="teen" ? (ans.tgoal==="teen"||!ans.tgoal||ans.tgoal==="general"?3:2) : ans.who ? 1 : 4; }
function drawQuiz(){
  var key = nextKey(), n = hist.length, total = Math.max(totalSteps(), n + (key?1:0));
  var prog = '<div class="q-progress" aria-hidden="true">'+Array.apply(null,{length:total}).map(function(_,i){ return '<i class="'+(i<n+(key?0:0)||!key?"on":"")+'"></i>'; }).join("")+'</div>';
  if(key){
    var q = Q[key];
    qcard.innerHTML = prog+'<div class="q-step"><p class="mono" style="color:var(--muted);margin-bottom:8px">Вопрос '+(n+1)+'</p><h3>'+q.t+'</h3><div class="q-opts">'+q.o.map(function(o){ return '<button type="button" class="q-opt" data-k="'+key+'" data-v="'+o[0]+'"><span>'+o[1]+'</span><span class="mono">→</span></button>'; }).join("")+'</div>'+(n?'<button type="button" class="q-back" id="qBack">← Назад</button>':'')+'</div>';
  } else {
    var c = byId(courseFromAns()), f = ans.fmt && ans.fmt!=="any" && c.formats[ans.fmt] ? ans.fmt : Object.keys(c.formats).reduce(function(a,b){ return priceOf(c.formats[a])<=priceOf(c.formats[b])?a:b; });
    var F = c.formats[f];
    qcard.innerHTML = prog+'<div class="q-result"><p class="mono" style="color:var(--muted)">Ваш билет</p><p class="big">'+c.name+'</p><p class="why">'+c.title+'. '+c.desc+'</p>'+
      '<div class="q-price">'+(F.month?'<div><b>'+fmtRub(F.month)+'</b><span>в месяц'+(Object.keys(c.formats).length>1?', '+FMT_LABEL[f].toLowerCase():'')+'</span></div>':'')+(F.lesson?'<div><b>'+fmtRub(F.lesson)+'</b><span>разовое занятие'+(F.min?', '+F.min+' мин':'')+'</span></div>':'')+'<div><b>500 ₽</b><span>пробный урок, 30 мин</span></div></div>'+
      '<div class="q-actions"><button type="button" class="btn-solid" id="qOpen">Подробнее и записаться</button><button type="button" class="btn-line" id="qAgain">Пройти заново</button></div></div>';
    $("#qOpen").addEventListener("click", function(){ openCourse(c.id, f); });
    $("#qAgain").addEventListener("click", function(){ ans={}; hist=[]; drawQuiz(); });
  }
  var back = $("#qBack"); if(back) back.addEventListener("click", function(){ var k = hist.pop(); delete ans[k]; drawQuiz(); });
  if(hasG && !RM) gsap.fromTo(qcard.children[1],{x:24},{x:0,duration:.4,ease:"power2.out"});
}
qcard.addEventListener("click", function(e){ var b = e.target.closest(".q-opt"); if(!b) return; var k=b.getAttribute("data-k"); ans[k]=b.getAttribute("data-v"); hist.push(k); drawQuiz(); });
drawQuiz();

/* ---------- GLOBE (canvas) ---------- */
(function(){
  var cv = $("#globe"); if(!cv || !cv.getContext) return;
  var ctx = cv.getContext("2d"), W=0, R=0, dpr=1, rot=0.6, tilt=-0.38, extra=0;
  var pts=[], N=900, ga=Math.PI*(3-Math.sqrt(5));
  for(var i=0;i<N;i++){ var y=1-(i/(N-1))*2, r=Math.sqrt(1-y*y), th=ga*i; pts.push([Math.cos(th)*r,y,Math.sin(th)*r]); }
  var cities = {MOW:[55.75,37.6,"Москва",8,-6],PAR:[48.85,2.35,"Париж",-14,18],LON:[51.5,-0.12,"Лондон",-52,-8],PDX:[45.5,-122.7,"Портленд",8,-6]};
  var routes=[["MOW","PAR"],["MOW","LON"],["LON","PDX"],["PAR","PDX"]];
  function ll(lat,lon){ var la=lat*Math.PI/180, lo=lon*Math.PI/180; return [Math.cos(la)*Math.sin(lo), Math.sin(la), Math.cos(la)*Math.cos(lo)]; }
  function slerp(a,b,t){ var d=Math.acos(Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])), s=Math.sin(d); if(s<1e-6) return a; var k1=Math.sin((1-t)*d)/s, k2=Math.sin(t*d)/s; return [a[0]*k1+b[0]*k2,a[1]*k1+b[1]*k2,a[2]*k1+b[2]*k2]; }
  function proj(p){ var c=Math.cos(rot+extra), s=Math.sin(rot+extra); var x=p[0]*c+p[2]*s, z=-p[0]*s+p[2]*c, y=p[1]; var ct=Math.cos(tilt), st=Math.sin(tilt); var y2=y*ct-z*st, z2=y*st+z*ct; return [W/2+x*R, W/2-y2*R, z2]; }
  function css(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  var col={};
  function readCols(){ col.ink=css("--ink"); col.cob=css("--cobalt"); col.st=css("--stamp"); col.sun=css("--sun"); }
  function size(){ var b=cv.getBoundingClientRect(); dpr=Math.min(2,window.devicePixelRatio||1); W=b.width; cv.width=W*dpr; cv.height=W*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); R=W*0.42; readCols(); }
  size(); window.addEventListener("resize", size);
  var mq = window.matchMedia("(prefers-color-scheme: dark)"); if(mq.addEventListener) mq.addEventListener("change", readCols);
  new MutationObserver(readCols).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  var t0=performance.now();
  function frame(now){
    var t=(now-t0)/1000; if(!RM) rot=0.6+t*0.12;
    ctx.clearRect(0,0,W,W);
    var g=ctx.createRadialGradient(W/2-R*.3,W/2-R*.3,R*.1,W/2,W/2,R*1.05); g.addColorStop(0,"rgba(120,140,255,.10)"); g.addColorStop(1,"rgba(120,140,255,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(W/2,W/2,R*1.05,0,7); ctx.fill();
    ctx.strokeStyle=col.ink; ctx.globalAlpha=.18; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(W/2,W/2,R,0,7); ctx.stroke();
    ctx.fillStyle=col.ink;
    for(var i=0;i<pts.length;i++){ var p=proj(pts[i]); if(p[2]<0){ ctx.globalAlpha=.06; ctx.fillRect(p[0],p[1],1.2,1.2); } else { ctx.globalAlpha=.15+p[2]*.45; var s=1+p[2]*1.4; ctx.beginPath(); ctx.arc(p[0],p[1],s/1.6,0,7); ctx.fill(); } }
    for(var r=0;r<routes.length;r++){
      var A=cities[routes[r][0]], B=cities[routes[r][1]], a=ll(A[0],A[1]), b=ll(B[0],B[1]);
      ctx.strokeStyle = r%2?col.st:col.cob; ctx.lineWidth=1.8; ctx.setLineDash([4,5]); ctx.beginPath(); var started=false;
      for(var k=0;k<=48;k++){ var q=slerp(a,b,k/48), h=1+Math.sin(Math.PI*k/48)*0.18; var pp=proj([q[0]*h,q[1]*h,q[2]*h]); if(pp[2]<-0.15){ started=false; continue; } ctx.globalAlpha=.85; if(!started){ ctx.moveTo(pp[0],pp[1]); started=true; } else ctx.lineTo(pp[0],pp[1]); }
      ctx.stroke(); ctx.setLineDash([]);
      var tt=((t*0.25)+r*0.27)%1, qm=slerp(a,b,tt), hm=1+Math.sin(Math.PI*tt)*0.18, pm=proj([qm[0]*hm,qm[1]*hm,qm[2]*hm]);
      if(pm[2]>-0.15){ ctx.globalAlpha=1; ctx.fillStyle=col.sun; ctx.beginPath(); ctx.arc(pm[0],pm[1],3.6,0,7); ctx.fill(); }
    }
    ctx.font="600 12px Onest, system-ui, sans-serif";
    for(var key in cities){ var c=cities[key], pc=proj(ll(c[0],c[1])); if(pc[2]<0.05) continue; ctx.globalAlpha=Math.min(1,pc[2]*2); ctx.fillStyle=col.st; ctx.beginPath(); ctx.arc(pc[0],pc[1],4.5,0,7); ctx.fill(); ctx.fillStyle=col.ink; ctx.fillText(c[2],pc[0]+c[3],pc[1]+c[4]); }
    ctx.globalAlpha=1;
    if(!RM) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__globeSpin = function(v){ extra=v; if(RM) requestAnimationFrame(frame); };
})();

/* ---------- MISC UI ---------- */
var burger=$("#burger"), mnav=$("#mnav");
burger.addEventListener("click", function(){ var o = mnav.hidden; mnav.hidden=!o; burger.setAttribute("aria-expanded", String(o)); });
$$("a[href^='#']").forEach(function(a){ a.addEventListener("click", function(e){
  var id=a.getAttribute("href"); if(id.length<2 || a.hasAttribute("data-open")) return; var el=$(id); if(!el) return;
  e.preventDefault(); mnav.hidden=true; burger.setAttribute("aria-expanded","false");
  if(window.__lenis) window.__lenis.scrollTo(el,{offset:-70,duration:1.2}); else el.scrollIntoView({behavior:RM?"auto":"smooth"});
}); });
var row=$("#reviewsRow");
$("#revPrev").addEventListener("click", function(){ row.scrollBy({left:-row.clientWidth*.8,behavior:"smooth"}); });
$("#revNext").addEventListener("click", function(){ row.scrollBy({left:row.clientWidth*.8,behavior:"smooth"}); });

/* rotating word */
(function(){
  var box=$("#swap"); if(!box) return;
  var words=["путешествий","карьеры","учёбы за рубежом","детей","медиков","книжного клуба"], i=0;
  if(RM) return;
  setInterval(function(){
    i=(i+1)%words.length; var old=box.firstElementChild, nw=document.createElement("span"); nw.textContent=words[i]; box.appendChild(nw);
    if(hasG){ gsap.fromTo(nw,{yPercent:105},{yPercent:0,duration:.7,ease:"expo.out"}); gsap.to(old,{yPercent:-105,duration:.6,ease:"expo.in",onComplete:function(){ old.remove(); }}); }
    else old.remove();
  },2400);
})();

/* ---------- GSAP + LENIS ---------- */
if(hasG && !RM){
  if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if(typeof window.Lenis!=="undefined"){
    var lenis = new Lenis({duration:1.15, smoothWheel:true, autoRaf:false});
    window.__lenis = lenis;
    if(window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0);
  }
  gsap.from(".hero h1 .line-mask>span",{yPercent:110,duration:1.1,stagger:.12,ease:"expo.out",delay:.1});
  gsap.from(".hero-ctas>*",{y:30,duration:.8,stagger:.1,ease:"power3.out",delay:.5});
  gsap.from(".pass",{y:60,rotation:-14,duration:1.2,ease:"elastic.out(1,.6)",delay:.6});
  gsap.from(".postmark",{scale:1.8,rotation:-40,duration:.8,ease:"back.out(2)",delay:.9});
  $$("[data-count]").forEach(function(el){ var o={v:0}, to=+el.getAttribute("data-count"); gsap.to(o,{v:to,duration:1.6,ease:"power2.out",delay:.4,onUpdate:function(){ el.textContent=Math.round(o.v); }}); });

  var mq = $("#marquee"), mtw = gsap.to(mq,{xPercent:-50,duration:28,ease:"none",repeat:-1});
  if(window.ScrollTrigger){
    ScrollTrigger.matchMedia({
      "(min-width: 900px)": function(){
        var track=$("#track");
        var dist=function(){ return Math.max(0, track.scrollWidth - window.innerWidth + 32); };
        gsap.to(track,{x:function(){ return -dist(); },ease:"none",scrollTrigger:{trigger:"#route",start:"top top",end:function(){ return "+="+dist(); },pin:true,scrub:.6,invalidateOnRefresh:true}});
        $$(".leg .meter i").forEach(function(m){ gsap.from(m,{scaleX:0,transformOrigin:"left",ease:"none",scrollTrigger:{trigger:"#route",start:"top top",end:function(){ return "+="+dist(); },scrub:true}}); });
      }
    });
    ScrollTrigger.create({onUpdate:function(s){ var v=Math.min(4,1+Math.abs(s.getVelocity())/600); gsap.to(mtw,{timeScale:v*(s.direction<0?-1:1),duration:.3,overwrite:true}); gsap.to(mtw,{timeScale:s.direction<0?-1:1,duration:1,delay:.3}); }});
    gsap.to({},{scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true,onUpdate:function(s){ if(window.__globeSpin) window.__globeSpin(s.progress*2.2); }}});
    gsap.to(".globe-wrap",{yPercent:18,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    $$(".sec-head h2").forEach(function(h){ gsap.from(h,{y:60,skewY:3,duration:1,ease:"expo.out",scrollTrigger:{trigger:h,start:"top 88%"}}); });
    gsap.from(".tool",{y:50,stagger:.1,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".tools",start:"top 85%"}});
    gsap.from(".visa",{x:40,stagger:.08,duration:.7,ease:"power3.out",scrollTrigger:{trigger:".visas",start:"top 85%"}});
    gsap.from(".visa-seal",{rotation:-90,stagger:.08,duration:.7,ease:"back.out(2)",scrollTrigger:{trigger:".visas",start:"top 85%"}});
    gsap.fromTo("#passport",{rotationY:-18,rotationX:6,transformPerspective:900},{rotationY:10,rotationX:-4,ease:"none",scrollTrigger:{trigger:"#founder",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.fromTo("#cert",{rotation:-6,y:60},{rotation:2,y:-20,ease:"none",scrollTrigger:{trigger:".cert-sec",start:"top bottom",end:"bottom top",scrub:true}});
    gsap.from(".postcard",{y:80,rotation:function(i){return i%2?8:-8;},stagger:.12,duration:1,ease:"power3.out",scrollTrigger:{trigger:"#reviewsRow",start:"top 85%"}});
    gsap.from(".contact h2",{yPercent:30,scale:.94,transformOrigin:"left bottom",ease:"none",scrollTrigger:{trigger:".contact",start:"top bottom",end:"top 30%",scrub:true}});
    window.addEventListener("load", function(){ ScrollTrigger.refresh(); });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ ScrollTrigger.refresh(); });
  }
  /* magnetic CTAs */
  $$(".magnet").forEach(function(el){
    el.addEventListener("pointermove", function(e){ var b=el.getBoundingClientRect(); gsap.to(el,{x:(e.clientX-b.left-b.width/2)*.25,y:(e.clientY-b.top-b.height/2)*.35,duration:.4,ease:"power3.out"}); });
    el.addEventListener("pointerleave", function(){ gsap.to(el,{x:0,y:0,duration:.6,ease:"elastic.out(1,.4)"}); });
  });
}
})();
