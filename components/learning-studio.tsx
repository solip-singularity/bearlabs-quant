"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowLeft, ArrowRight, BarChart3, BookMarked, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, ClipboardCheck, Code2, Compass, FlaskConical, GitBranch, GraduationCap, Heart, LayoutDashboard, Library, Menu, Moon, Search, Sparkles, Sun, Target, X } from "lucide-react";
import { chapters, chapterMap, learningPaths, lessonMap, lessons, stages, totalExercises, totalUnits, type Exercise, type Lesson } from "@/lib/curriculum";

type View = "catalog" | "lesson" | "practice" | "labs" | "paths" | "dashboard" | "about";
type Mode = "pro" | "kid";
const STORE = "method-atlas-v3";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function LearningStudio() {
  const [view, setView] = useState<View>("catalog");
  const [mode, setMode] = useState<Mode>("pro");
  const [lessonId, setLessonId] = useState("c01-l01");
  const [completed, setCompleted] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
      setLessonId(saved.lessonId || "c01-l01"); setMode(saved.mode || "pro");
      setCompleted(saved.completed || []); setFavorites(saved.favorites || []); setMistakes(saved.mistakes || []); setDark(saved.dark || false);
    } catch { /* Local state is optional. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORE, JSON.stringify({ lessonId, mode, completed, favorites, mistakes, dark })); }, [ready, lessonId, mode, completed, favorites, mistakes, dark]);

  const lesson = lessonMap.get(lessonId) ?? lessons[0];
  const openLesson = (id: string) => { setLessonId(id); setView("lesson"); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggle = (id: string, list: string[], setList: (v: string[]) => void) => setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  return <div className={dark ? "site dark" : "site"}>
    <Header view={view} setView={setView} mode={mode} setMode={setMode} dark={dark} setDark={setDark} onMenu={() => setMobileMenu(true)} progress={completed.length / lessons.length * 100} />
    {view === "catalog" && <Catalog query={query} setQuery={setQuery} openLesson={openLesson} completed={completed} onAbout={() => setView("about")} />}
    {view === "lesson" && <LessonWorkspace lesson={lesson} mode={mode} setMode={setMode} completed={completed} favorite={favorites.includes(lesson.id)} onComplete={() => toggle(lesson.id, completed, setCompleted)} onFavorite={() => toggle(lesson.id, favorites, setFavorites)} openLesson={openLesson} openPractice={() => setView("practice")} mobileMenu={mobileMenu} closeMobile={() => setMobileMenu(false)} />}
    {view === "practice" && <Practice lesson={lesson} openLesson={openLesson} mistakes={mistakes} setMistakes={setMistakes} onComplete={() => { if (!completed.includes(lesson.id)) setCompleted([...completed, lesson.id]); }} />}
    {view === "labs" && <Labs />}
    {view === "paths" && <Paths openLesson={openLesson} completed={completed} />}
    {view === "dashboard" && <Dashboard completed={completed} favorites={favorites} mistakes={mistakes} openLesson={openLesson} />}
    {view === "about" && <About />}
  </div>;
}

function Header({ view, setView, mode, setMode, dark, setDark, onMenu, progress }: { view: View; setView:(v:View)=>void; mode:Mode; setMode:(m:Mode)=>void; dark:boolean; setDark:(v:boolean)=>void; onMenu:()=>void; progress:number }) {
  const nav: [View,string,React.ElementType][] = [["catalog","课程",Library],["paths","学习路径",Compass],["labs","实验室",FlaskConical],["practice","必做题",ClipboardCheck],["dashboard","学习面板",LayoutDashboard],["about","关于",GraduationCap]];
  return <header className="topbar"><div className="topbar-inner">
    <button className="icon-button mobile-only" onClick={onMenu} aria-label="打开课程目录"><Menu size={20}/></button>
    <button className="brand" onClick={() => setView("catalog")}><span className="brand-mark">贝</span><span><b>贝尔实验室</b><small>BearLabs · Quantitative Research</small></span></button>
    <nav className="main-nav" aria-label="主导航">{nav.map(([id,label,Icon]) => <button key={id} className={view===id ? "active" : ""} onClick={()=>setView(id)}><Icon size={15}/>{label}</button>)}</nav>
    <div className="header-actions"><div className="mode-toggle"><button className={mode==="kid"?"active":""} onClick={()=>setMode("kid")}>宝宝版</button><button className={mode==="pro"?"active":""} onClick={()=>setMode("pro")}>专业版</button></div><button className="icon-button" onClick={()=>setDark(!dark)} aria-label="切换深色模式">{dark?<Sun size={18}/>:<Moon size={18}/>}</button><div className="header-progress"><span>{Math.round(progress)}%</span><i><b style={{width:`${progress}%`}}/></i></div></div>
  </div></header>;
}

function Catalog({ query, setQuery, openLesson, completed, onAbout }: { query:string; setQuery:(v:string)=>void; openLesson:(id:string)=>void; completed:string[]; onAbout:()=>void }) {
  const matches = useMemo(() => query.trim() ? lessons.filter(l => `${l.title}${l.keywords.join("")}${l.objectives.join("")}`.toLowerCase().includes(query.toLowerCase())).slice(0,20) : [], [query]);
  return <main><section className="catalog-hero"><div><span className="overline">BEARLABS · QUANTITATIVE RESEARCH</span><h1>在不确定性里<br/><em>找到可检验的秩序。</em></h1><p>从概率直觉到博士论文。不是术语清单：每一课都回答为什么用、怎么做、比什么更好、什么时候会错。</p></div><div className="hero-stats"><div><b>24</b><span>完整章节</span></div><div><b>180</b><span>独立课时</span></div><div><b>{totalUnits}</b><span>学习单元</span></div><div><b>{totalExercises}</b><span>分级习题</span></div></div></section>
    <section className="catalog-shell"><div className="search-panel"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索课程、公式、方法或案例…"/><kbd>⌘ K</kbd></div>
      {matches.length > 0 && <div className="search-results"><div className="section-kicker">搜索结果 · {matches.length}</div>{matches.map(l => <button key={l.id} onClick={()=>openLesson(l.id)}><span>{l.id.toUpperCase()}</span><b>{l.title}</b><small>{chapterMap.get(l.chapterId)?.title}</small><ArrowRight size={16}/></button>)}</div>}
      {!query && <><div className="catalog-intro"><div><span className="section-kicker">课程目录</span><h2>三阶段知识地图</h2></div><p>按顺序学习，也可以从研究问题直接进入。所有课程都有专业版与宝宝巴士版。</p></div>
        {stages.map(stage => <section className="stage" key={stage.id} style={{"--stage":stage.color} as React.CSSProperties}><div className="stage-head"><span>{stage.eyebrow}</span><div><h2>{stage.title}</h2><p>{stage.description}</p></div><b>{stage.chapterIds.reduce((n,id)=>n+(chapterMap.get(id)?.lessonIds.length||0),0)} 课</b></div>
          <div className="chapter-grid">{stage.chapterIds.map(id => { const c=chapterMap.get(id)!; const done=c.lessonIds.filter(x=>completed.includes(x)).length; return <article className="chapter-card" key={id}><div className="chapter-number">{String(id).padStart(2,"0")}</div><div className="chapter-meta"><span>{c.level}</span><span>{c.units.length} 单元</span><span>{c.lessonIds.length} 课</span></div><h3>{c.title}</h3><p>{c.summary}</p><div className="topic-row">{c.topics.slice(0,4).map(t=><span key={t}>{t}</span>)}</div><div className="card-foot"><div><i><b style={{width:`${done/c.lessonIds.length*100}%`}}/></i><small>{done}/{c.lessonIds.length}</small></div><button onClick={()=>openLesson(c.lessonIds[0])}>查看课程 <ArrowRight size={15}/></button></div></article>})}</div>
        </section>)}
        <section className="author-teaser"><img src={`${PUBLIC_BASE}/author-avatar.jpg`} alt="作者 Solips-Singularitat"/><div><span className="section-kicker">ABOUT THE AUTHOR</span><h2>一座由研究问题驱动的个人实验室</h2><p>本站由 Solips-Singularitat 独立完成内容设计与开发，并与中国美术学院网络社会研究所的研究兴趣保持对话。</p></div><button onClick={onAbout}>关于本站与作者 <ArrowRight size={16}/></button></section>
      </>}
    </section></main>;
}

function LessonWorkspace({ lesson, mode, setMode, completed, favorite, onComplete, onFavorite, openLesson, openPractice, mobileMenu, closeMobile }: { lesson:Lesson; mode:Mode; setMode:(m:Mode)=>void; completed:string[]; favorite:boolean; onComplete:()=>void; onFavorite:()=>void; openLesson:(id:string)=>void; openPractice:()=>void; mobileMenu:boolean; closeMobile:()=>void }) {
  const chapter = chapterMap.get(lesson.chapterId)!; const idx = lessons.findIndex(l=>l.id===lesson.id); const [copied,setCopied] = useState(false);
  return <div className="lesson-layout"><LessonSidebar lesson={lesson} completed={completed} openLesson={openLesson} className={mobileMenu?"open":""} onClose={closeMobile}/>{mobileMenu && <button className="scrim" onClick={closeMobile} aria-label="关闭目录"/>}
    <article className="lesson-article"><div className="breadcrumbs"><button onClick={()=>openLesson(chapter.lessonIds[0])}>第 {chapter.id} 章</button><ChevronRight size={14}/><span>{chapter.title}</span><ChevronRight size={14}/><span>第 {lesson.order} 课</span></div>
      <header className="lesson-header"><div className="lesson-label"><span>{lesson.id.toUpperCase()}</span><span>{lesson.difficulty}</span><span>{lesson.minutes} 分钟</span></div><h1>{lesson.title}</h1><p>{chapter.summary}</p><div className="lesson-actions"><button className={completed.includes(lesson.id)?"done":"primary"} onClick={onComplete}>{completed.includes(lesson.id)?<CheckCircle2 size={17}/>:<Check size={17}/>} {completed.includes(lesson.id)?"已完成":"标记完成"}</button><button onClick={onFavorite}><Heart size={17} fill={favorite?"currentColor":"none"}/>{favorite?"已收藏":"收藏"}</button></div></header>
      <section className="overview-grid"><div className="paper-card objectives"><span className="card-eyebrow"><Target size={15}/>学习目标</span><ol>{lesson.objectives.map((x,i)=><li key={x}><b>{i+1}</b>{x}</li>)}</ol></div><div className="paper-card lesson-info"><div><small>先修知识</small><b>{lesson.prerequisites.join("、")}</b></div><div><small>本课关键词</small><p>{lesson.keywords.slice(0,5).map(x=><span key={x}>{x}</span>)}</p></div></div></section>
      <div className="reading-toggle"><span><BookOpen size={17}/>讲解模式</span><div><button className={mode==="pro"?"active":""} onClick={()=>setMode("pro")}>专业版</button><button className={mode==="kid"?"kid-active":""} onClick={()=>setMode("kid")}>宝宝巴士版</button></div><small>{mode==="pro"?"严谨定义 · 推导 · 研究边界":"比喻 · 分步骤 · 不省略重点"}</small></div>
      {lesson.sections.map((section,i)=><section className="reading-section" id={section.id} key={section.id}><div className="section-index">{String(i+1).padStart(2,"0")}</div><div><h2>{section.title}</h2>{(mode==="pro"?section.pro:section.kid).map((p,j)=><p key={j}>{p}</p>)}{i===2 && <FormulaBox lesson={lesson}/>}</div></section>)}
      <section className="content-block"><BlockTitle icon={<BarChart3/>} overline="METHOD COMPARISON" title="什么时候选它，什么时候不要选"/><div className="table-wrap"><table><thead><tr><th>方法</th><th>最适合回答</th><th>优势</th><th>限制</th></tr></thead><tbody>{lesson.comparison.map(r=><tr key={r.method}><th>{r.method}</th><td>{r.bestFor}</td><td>{r.strength}</td><td>{r.limit}</td></tr>)}</tbody></table></div></section>
      <section className="content-block example"><BlockTitle icon={<Sparkles/>} overline="WORKED EXAMPLE" title="完整例题：从问题到结论"/><div className="case-question">{lesson.workedExample.question}</div><ol className="steps">{lesson.workedExample.steps.map((x,i)=><li key={x}><b>{i+1}</b><span>{x}</span></li>)}</ol><div className="answer-box"><b>结论与边界</b><p>{lesson.workedExample.answer}</p></div></section>
      <section className="content-block code-block"><div className="block-title"><Code2/><div><span>PYTHON LAB</span><h2>可复现代码</h2></div><button onClick={async()=>{await navigator.clipboard.writeText(lesson.python);setCopied(true);setTimeout(()=>setCopied(false),1500)}}>{copied?"已复制":"复制代码"}</button></div><pre><code>{lesson.python}</code></pre><div className="output"><b>怎样读输出</b><p>{lesson.expectedOutput}</p></div></section>
      <section className="content-block report"><BlockTitle icon={<BookMarked/>} overline="REPORTING" title="论文报告骨架"/><blockquote>{lesson.reportTemplate}</blockquote></section>
      <section className="content-block"><BlockTitle icon={<GraduationCap/>} overline="GLOSSARY & REFERENCES" title="术语与延伸阅读"/><div className="glossary">{lesson.glossary.map(g=><div key={g.term}><b>{g.term}</b><p>{g.meaning}</p></div>)}</div><ul className="references">{lesson.references.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section className="practice-cta"><div><span>本课训练 · 10 题</span><h2>现在检查你是否真的会用</h2><p>4 道简单、4 道中等、2 道困难题，每题都有分步解析与宝宝版解释。</p></div><button onClick={openPractice}>开始练习 <ArrowRight size={17}/></button></section>
      <nav className="lesson-pager"><button disabled={idx===0} onClick={()=>openLesson(lessons[idx-1]?.id)}><ArrowLeft size={16}/><span><small>上一课</small>{lessons[idx-1]?.title}</span></button><button disabled={idx===lessons.length-1} onClick={()=>openLesson(lessons[idx+1]?.id)}><span><small>下一课</small>{lessons[idx+1]?.title}</span><ArrowRight size={16}/></button></nav>
    </article><aside className="toc"><span>本课目录</span>{lesson.sections.map((s,i)=><a href={`#${s.id}`} key={s.id}><b>{String(i+1).padStart(2,"0")}</b>{s.title}</a>)}<div className="toc-note"><b>学习提示</b><p>先读用途，再动手做例题。遇到公式时，先说清每个符号代表什么。</p></div></aside>
  </div>;
}

function BlockTitle({icon,overline,title}:{icon:React.ReactNode;overline:string;title:string}) { return <div className="block-title">{icon}<div><span>{overline}</span><h2>{title}</h2></div></div> }
function LessonSidebar({ lesson, completed, openLesson, className, onClose }: { lesson:Lesson; completed:string[]; openLesson:(id:string)=>void; className:string; onClose:()=>void }) { const chapter = chapterMap.get(lesson.chapterId)!; const n=chapter.lessonIds.filter(x=>completed.includes(x)).length; return <aside className={`lesson-sidebar ${className}`}><div className="sidebar-head"><div><span>第 {chapter.id} 章</span><b>{chapter.title}</b></div><button onClick={onClose}><X size={18}/></button></div><div className="sidebar-progress"><div><span>章节进度</span><b>{n}/{chapter.lessonIds.length}</b></div><i><b style={{width:`${n/chapter.lessonIds.length*100}%`}}/></i></div><div className="unit-list">{chapter.units.map(unit=><details key={unit.id} open><summary><span>{unit.title}</span><ChevronDown size={15}/></summary>{unit.lessonIds.map(id=>{const l=lessonMap.get(id)!;return <button className={id===lesson.id?"active":""} key={id} onClick={()=>openLesson(id)}><span>{completed.includes(id)?<Check size={12}/>:l.order}</span><div><b>{l.title}</b><small>{l.minutes} 分钟 · {l.difficulty}</small></div></button>})}</details>)}</div></aside> }
function FormulaBox({ lesson }: { lesson:Lesson }) { return <div className="formula-box"><div><span>核心表达</span><strong>{lesson.formula}</strong></div><ul>{lesson.symbolNotes.map(x=><li key={x}>{x}</li>)}</ul></div> }

function Practice({ lesson, openLesson, mistakes, setMistakes, onComplete }: { lesson:Lesson; openLesson:(id:string)=>void; mistakes:string[]; setMistakes:(v:string[])=>void; onComplete:()=>void }) {
  const [level,setLevel]=useState<"全部"|"简单"|"中等"|"困难">("全部"); const [opened,setOpened]=useState<string[]>([]); const items=lesson.exercises.filter(x=>level==="全部"||x.level===level);
  return <main className="wide-page"><div className="page-heading"><button className="back" onClick={()=>openLesson(lesson.id)}><ArrowLeft size={16}/>返回课程</button><span className="section-kicker">PRACTICE · {lesson.id.toUpperCase()}</span><h1>{lesson.title}</h1><p>不要急着看答案。先写出判断依据，再展开分步解析。</p></div><div className="practice-toolbar"><div>{(["全部","简单","中等","困难"] as const).map(x=><button className={level===x?"active":""} key={x} onClick={()=>setLevel(x)}>{x}</button>)}</div><span>10 题 · 简单 4 / 中等 4 / 困难 2</span></div><div className="exercise-list">{items.map(ex=><ExerciseCard key={ex.id} ex={ex} index={lesson.exercises.indexOf(ex)+1} open={opened.includes(ex.id)} onOpen={()=>setOpened(opened.includes(ex.id)?opened.filter(x=>x!==ex.id):[...opened,ex.id])} mistake={mistakes.includes(ex.id)} toggleMistake={()=>setMistakes(mistakes.includes(ex.id)?mistakes.filter(x=>x!==ex.id):[...mistakes,ex.id])}/>)}</div><div className="complete-strip"><div><b>已查看 {opened.length} / {items.length} 题解析</b><span>完成后会计入本地学习进度</span></div><button onClick={onComplete}><CheckCircle2 size={17}/>完成本课</button></div></main>;
}
function ExerciseCard({ ex,index,open,onOpen,mistake,toggleMistake }: { ex:Exercise; index:number; open:boolean; onOpen:()=>void; mistake:boolean; toggleMistake:()=>void }) { return <article className={`exercise-card ${open?"open":""}`}><button className="exercise-question" onClick={onOpen}><span className={`level ${ex.level}`}>{ex.level}</span><span className="qtype">{ex.type}</span><b>{index}. {ex.prompt}</b><ChevronDown size={18}/></button>{open&&<div className="solution"><div className="solution-head"><span>完整解析</span><button onClick={toggleMistake}><Heart size={15} fill={mistake?"currentColor":"none"}/>{mistake?"已加入错题":"加入错题"}</button></div><h4>解题思路</h4><p>{ex.solution.idea}</p><h4>分步过程</h4><ol>{ex.solution.steps.map((x,i)=><li key={x}><b>{i+1}</b>{x}</li>)}</ol><h4>最终答案</h4><p>{ex.solution.result}</p><div className="solution-grid"><div><b>常见错误</b><p>{ex.solution.pitfalls}</p></div><div><b>宝宝版解释</b><p>{ex.solution.kid}</p></div></div>{ex.solution.code&&<pre><code>{ex.solution.code}</code></pre>}</div>}</article> }

function Labs() { const [mean,setMean]=useState(0); const [sd,setSd]=useState(1); const [adjust,setAdjust]=useState(true); const data=useMemo(()=>Array.from({length:101},(_,i)=>{const x=-5+i*.1;return{x,y:Math.exp(-.5*Math.pow((x-mean)/sd,2))/(sd*Math.sqrt(2*Math.PI))}}),[mean,sd]); return <main className="wide-page"><div className="page-heading"><span className="section-kicker">INTERACTIVE LABS</span><h1>把抽象方法变成可操作的实验</h1><p>改变参数，立即观察分布和因果识别怎样变化。</p></div><div className="lab-grid"><section className="lab-card wide"><div className="lab-title"><FlaskConical/><div><span>概率与分布</span><h2>正态分布实验室</h2></div></div><div className="chart"><ResponsiveContainer width="100%" height={300}><AreaChart data={data}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#19736d" stopOpacity=".5"/><stop offset="1" stopColor="#19736d" stopOpacity=".03"/></linearGradient></defs><CartesianGrid vertical={false} strokeDasharray="3 3"/><XAxis dataKey="x"/><YAxis width={36}/><ReferenceLine x={mean} stroke="#ba6438" strokeDasharray="4 4"/><Area dataKey="y" stroke="#19736d" fill="url(#fill)"/></AreaChart></ResponsiveContainer></div><div className="controls"><label>均值 μ <b>{mean.toFixed(1)}</b><input type="range" min="-2" max="2" step=".1" value={mean} onChange={e=>setMean(+e.target.value)}/></label><label>标准差 σ <b>{sd.toFixed(1)}</b><input type="range" min=".4" max="2" step=".1" value={sd} onChange={e=>setSd(+e.target.value)}/></label></div></section><section className="lab-card"><div className="lab-title"><GitBranch/><div><span>因果推断</span><h2>DAG 调整实验</h2></div></div><div className="dag"><span className="c">家庭背景 C</span><span className="a">教育投入 A</span><span className="y">就业结果 Y</span><svg><line x1="28%" y1="46%" x2="48%" y2="25%"/><line x1="30%" y1="55%" x2="75%" y2="70%"/><line x1="56%" y1="28%" x2="78%" y2="65%"/></svg></div><button className={`adjust ${adjust?"on":""}`} onClick={()=>setAdjust(!adjust)}><span>{adjust?<Check/>:null}</span>调整家庭背景 C</button><p className={adjust?"lab-good":"lab-warn"}>{adjust?"后门路径 A ← C → Y 被阻断；在没有其他未测混杂的前提下，可以识别效果。":"混杂路径保持开放，A 与 Y 的关联混入家庭背景差异。"}</p></section></div></main> }

function Paths({ openLesson, completed }: { openLesson:(id:string)=>void; completed:string[] }) { return <main className="wide-page"><div className="page-heading"><span className="section-kicker">LEARNING PATHS</span><h1>按研究目标，而不是按软件菜单学习</h1><p>六条路线共享基础课，但在真实研究任务处分流。</p></div><div className="path-grid">{learningPaths.map((path,i)=><article key={path.title}><span>PATH {String(i+1).padStart(2,"0")}</span><h2>{path.title}</h2><p>{path.description}</p><div>{path.chapters.map((id,j)=><button key={id} onClick={()=>openLesson(chapterMap.get(id)!.lessonIds[0])}><i>{completed.some(x=>x.startsWith(`c${String(id).padStart(2,"0")}`))? <Check size={12}/>:j+1}</i><span><b>第 {id} 章 · {chapterMap.get(id)!.title}</b><small>{chapterMap.get(id)!.lessonIds.length} 课</small></span><ChevronRight size={16}/></button>)}</div></article>)}</div></main> }
function Dashboard({ completed,favorites,mistakes,openLesson }: { completed:string[]; favorites:string[]; mistakes:string[]; openLesson:(id:string)=>void }) {
  const pct=Math.round(completed.length/lessons.length*100);
  return <main className="wide-page"><div className="page-heading"><span className="section-kicker">YOUR DASHBOARD</span><h1>学习面板</h1><p>数据仅保存在当前浏览器，不会上传。</p></div><div className="dashboard-stats"><div><b>{pct}%</b><span>总体进度</span></div><div><b>{completed.length}</b><span>已完成课程</span></div><div><b>{favorites.length}</b><span>收藏课程</span></div><div><b>{mistakes.length}</b><span>错题记录</span></div></div><div className="dashboard-grid"><section><h2>最近收藏</h2>{favorites.length?favorites.slice(-8).reverse().map(id=><button key={id} onClick={()=>openLesson(id)}><BookMarked size={16}/><span><b>{lessonMap.get(id)?.title}</b><small>{id.toUpperCase()}</small></span><ArrowRight size={15}/></button>):<Empty text="还没有收藏课程"/>}</section><section><h2>章节完成度</h2>{chapters.map(c=><ChapterProgress key={c.id} chapterId={c.id} title={c.title} ids={c.lessonIds} completed={completed}/>)}</section></div></main>;
}
function ChapterProgress({ chapterId,title,ids,completed }:{ chapterId:number; title:string; ids:string[]; completed:string[] }) {
  const count=ids.filter(id=>completed.includes(id)).length;
  return <div className="chapter-progress"><span>{chapterId}. {title}</span><b>{count}/{ids.length}</b><i><em style={{width:`${count/ids.length*100}%`}}/></i></div>;
}
function Empty({text}:{text:string}) { return <div className="empty"><BookOpen/><p>{text}</p></div> }

function About() {
  return <main className="about-page">
    <header className="about-hero"><span className="section-kicker">ABOUT · 关于</span><h1>关于贝尔实验室 · 量化研究学习站</h1><p>一座研究“如何知道”的个人学习站：从概率、测量和因果，到田野、编码与博士论文。</p></header>
    <section className="author-profile"><img src={`${PUBLIC_BASE}/author-avatar.jpg`} alt="作者 Solips-Singularitat"/><div><span>AUTHOR · 内容与开发</span><h2>Solips-Singularitat</h2><p>本站作者，负责课程策划、内容写作、交互设计与开发。关注网络社会、数字文化、研究方法，以及技术如何改变知识生产。</p><div className="profile-links"><a href="mailto:2451101123@qq.com">2451101123@qq.com</a><a href="https://github.com/solip-singularity" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></section>
    <div className="about-grid">
      <section className="about-prose"><span className="section-kicker">WHY THIS SITE</span><h2>为什么建立这个学习站</h2><p>这是“贝尔实验室”学习项目的量化研究分站。概率把不确定性变成可以讨论的语言，但真实研究不只需要计算：它还需要提出好问题、理解资料如何生成、知道一个结论能够走多远。</p><p>因此，这里不是统计软件说明书，也不是方法名词陈列馆。课程从大学概率统计出发，逐步进入社会科学量化方法、质性研究、因果推断、证据综合和博士论文实践。</p><blockquote>复杂方法的价值，不在于显得复杂，而在于让研究问题、证据与结论之间的关系更清楚。</blockquote>
        <h3>怎样使用本站</h3><ul><li>从学习路径选一条主线，或从课程目录直接进入具体问题。</li><li>先读“为什么用”，再操作例题与实验，最后完成十道分级练习。</li><li>专业版负责严谨定义与证据边界；宝宝巴士版负责把同一逻辑讲到真正听懂。</li></ul>
        <h3>数据与隐私</h3><p>学习进度、收藏与错题默认只保存在当前浏览器，不上传到服务器。访谈、田野笔记和其他敏感研究资料不应提交给任何未经伦理审批的在线工具。</p>
      </section>
      <aside className="about-facts"><div><small>课程规模</small><b>24 章 · 180 课</b></div><div><small>练习系统</small><b>1800 道分级题</b></div><div><small>核心受众</small><b>社会科学学习者</b></div><div><small>项目性质</small><b>个人教育项目</b></div></aside>
    </div>
    <section className="institute-profile"><img src={`${PUBLIC_BASE}/ins-icon.jpg`} alt="中国美术学院网络社会研究所 INS 图标"/><div><span className="section-kicker">INS · RESEARCH CONTEXT</span><h2>中国美术学院 · 网络社会研究所</h2><p className="institute-en">Institute of Network Society, School of Intermedia Art, China Academy of Art</p><p>网络社会研究所关注网络社会中的理论、艺术与实践问题——从平台与算法，到数字文化与媒介理论。其工作包括网络社会年会、国际讲座与研究者论坛、黑客松与工作坊，以及出版与译介。</p><p className="disclaimer">本站作者来自该研究所。本网站是个人学习与交流项目，不代表研究所官方发布；研究所信息如与官网不一致，以官网为准。</p><a href="https://www.caa-ins.org/" target="_blank" rel="noreferrer">访问研究所官网 ↗</a></div></section>
    <footer className="about-footer"><span>BearLabs · Quantitative Research · 2026</span><p>让方法回到问题，让证据保持诚实。</p></footer>
  </main>;
}
