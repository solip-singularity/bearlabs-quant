"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, ChevronRight, Compass, Network, Search, Sigma } from "lucide-react";
import { methodCategories, methodNodes, type MethodCategory, type MethodNode } from "@/lib/method-graph";

type MethodAtlasProps = {
  openLesson: (lessonId: string) => void;
};

export function MethodAtlas({ openLesson }: MethodAtlasProps) {
  const [categoryId, setCategoryId] = useState(methodCategories[0].id);
  const [branchId, setBranchId] = useState<string | null>(methodCategories[0].branches[0].id);
  const [methodId, setMethodId] = useState(methodCategories[0].branches[0].methods[0].id);
  const [query, setQuery] = useState("");

  const category = methodCategories.find(item => item.id === categoryId) ?? methodCategories[0];
  const branch = category.branches.find(item => item.id === branchId) ?? null;
  const selected = methodNodes.find(item => item.id === methodId) ?? category.branches[0].methods[0];
  const categoryMethods = category.branches.flatMap(item => item.methods);
  const selectedIndex = categoryMethods.findIndex(item => item.id === selected.id);

  const searchResults = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return methodCategories.flatMap(cat => cat.branches.flatMap(group =>
      group.methods
        .filter(method => `${method.title}${method.summary}${method.data}${method.keywords.join("")}`.toLowerCase().includes(keyword))
        .map(method => ({ category: cat, branch: group, method }))
    )).slice(0, 18);
  }, [query]);

  const selectCategory = (next: MethodCategory) => {
    const firstBranch = next.branches[0];
    setCategoryId(next.id);
    setBranchId(firstBranch.id);
    setMethodId(firstBranch.methods[0].id);
    setQuery("");
  };

  const selectSearchResult = (cat: MethodCategory, nextBranchId: string, method: MethodNode) => {
    setCategoryId(cat.id);
    setBranchId(nextBranchId);
    setMethodId(method.id);
    setQuery("");
  };

  const moveSelection = (offset: number) => {
    const next = categoryMethods[selectedIndex + offset];
    if (!next) return;
    const nextBranch = category.branches.find(item => item.methods.some(method => method.id === next.id));
    setBranchId(nextBranch?.id ?? null);
    setMethodId(next.id);
  };

  return <main className="atlas-page">
    <header className="atlas-hero">
      <div><span className="section-kicker">METHOD ATLAS · 方法知识图谱</span><h1>从研究问题，走到正确的方法。</h1><p>不要从公式名称出发。先判断研究目的、资料尺度、样本关系与识别条件，再查看适用公式、失败边界和替代方案。</p></div>
      <div className="atlas-legend"><span><i className="legend-question"/>判断节点</span><span><i className="legend-method"/>方法节点</span><span><i className="legend-warning"/>边界与警告</span></div>
    </header>

    <div className="atlas-search">
      <Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索公式、数据类型或研究方法，例如：配对、计数、扎根理论…" aria-label="搜索方法图谱"/>
      <span>{methodNodes.length} 种方法</span>
      {query && <div className="atlas-search-results" role="listbox" aria-label="方法搜索结果">
        {searchResults.length ? searchResults.map(result => <button key={result.method.id} onClick={() => selectSearchResult(result.category, result.branch.id, result.method)}>
          <span>{result.category.shortTitle} · {result.branch.title}</span><b>{result.method.title}</b><small>{result.method.summary}</small><ArrowRight size={15}/>
        </button>) : <p>没有匹配的方法。试试“均值”“类别”“因果”或“质性”。</p>}
      </div>}
    </div>

    <div className="atlas-layout">
      <aside className="atlas-categories" aria-label="方法分类">
        <div className="atlas-side-title"><Network size={18}/><span><b>七类方法</b><small>先选择研究问题所在区域</small></span></div>
        {methodCategories.map((item, index) => <button key={item.id} className={item.id === category.id ? "active" : ""} style={{"--atlas-color": item.color} as React.CSSProperties} onClick={() => selectCategory(item)}>
          <i>{String(index + 1).padStart(2, "0")}</i><span><b>{item.shortTitle}</b><small>{item.branches.reduce((sum, group) => sum + group.methods.length, 0)} 种方法</small></span><ChevronRight size={15}/>
        </button>)}
        <div className="atlas-side-note"><Compass size={17}/><p><b>选择原则</b>先问资料怎样产生，再问公式怎样计算。显著性不能修复错误的研究设计。</p></div>
      </aside>

      <section className="atlas-map" style={{"--atlas-color": category.color} as React.CSSProperties} aria-label={`${category.title}决策树`}>
        <nav className="atlas-crumbs" aria-label="图谱位置">
          <button onClick={() => setBranchId(null)}>{category.shortTitle}</button>
          {branch && <><ChevronRight size={13}/><button onClick={() => setMethodId(branch.methods[0].id)}>{branch.title}</button></>}
          {selected && <><ChevronRight size={13}/><span>{selected.title}</span></>}
        </nav>

        <div className="atlas-root-node"><span>研究目的</span><b>{category.rootQuestion}</b><small>{category.description}</small></div>
        <div className="atlas-trunk" aria-hidden="true"/>
        <div className="atlas-branch-list">
          {category.branches.map(group => {
            const active = group.id === branchId;
            return <div className={`atlas-branch ${active ? "active" : ""}`} key={group.id}>
              <button className="atlas-question-node" onClick={() => setBranchId(active ? null : group.id)} aria-expanded={active}>
                <span>{group.title}</span><b>{group.question}</b><small>{active ? "收起方法" : `展开 ${group.methods.length} 种方法`}</small>
              </button>
              {active && <div className="atlas-method-nodes">
                {group.methods.map(method => <button key={method.id} className={method.id === selected.id ? "selected" : ""} onClick={() => setMethodId(method.id)}>
                  {method.mode === "formula" ? <Sigma size={16}/> : <Compass size={16}/>}<span><b>{method.title}</b><small>{method.mode === "formula" ? "公式方法" : "分析流程"}</small></span><ChevronRight size={14}/>
                </button>)}
              </div>}
            </div>;
          })}
        </div>
        {!branch && <div className="atlas-map-hint"><ArrowLeft size={16}/><span>选择一个判断节点，沿决策路径查看推荐方法。</span></div>}
      </section>

      <MethodCard method={selected} onOpenLesson={() => openLesson(selected.lessonId)} onPrevious={() => moveSelection(-1)} onNext={() => moveSelection(1)} hasPrevious={selectedIndex > 0} hasNext={selectedIndex < categoryMethods.length - 1}/>
    </div>
  </main>;
}

function MethodCard({ method, onOpenLesson, onPrevious, onNext, hasPrevious, hasNext }: { method: MethodNode; onOpenLesson: () => void; onPrevious: () => void; onNext: () => void; hasPrevious: boolean; hasNext: boolean }) {
  return <aside className="method-card" aria-live="polite">
    <header><span>{method.mode === "formula" ? "FORMULA METHOD" : "RESEARCH PROCESS"}</span><h2>{method.title}</h2><p>{method.summary}</p></header>
    <section className="method-data"><b>先确认你的资料</b><p>{method.data}</p></section>

    {method.formula ? <section className="method-formula"><span><Sigma size={15}/>核心公式</span><strong>{method.formula.expression}</strong><ul>{method.formula.symbols.map(symbol => <li key={symbol}>{symbol}</li>)}</ul></section> : <section className="method-process"><span><Compass size={15}/>分析流程</span><ol>{method.process?.map((step, index) => <li key={step}><b>{index + 1}</b><p>{step}</p></li>)}</ol></section>}

    <DetailList title="什么时候使用" tone="good" items={method.useWhen}/>
    <DetailList title="必须满足或检查" tone="neutral" items={method.assumptions}/>
    <DetailList title="不要这样使用" tone="warning" items={method.avoidWhen}/>
    <DetailList title="常见误用" tone="danger" items={method.mistakes}/>
    <DetailList title="替代方法" tone="alternative" items={method.alternatives}/>

    <button className="method-lesson-link" onClick={onOpenLesson}><BookOpen size={17}/><span><small>对应课程</small><b>进入 {method.lessonId.toUpperCase()} 完整学习</b></span><ArrowRight size={17}/></button>
    <nav className="method-card-pager" aria-label="前后方法"><button disabled={!hasPrevious} onClick={onPrevious}><ArrowLeft size={15}/>上一方法</button><button disabled={!hasNext} onClick={onNext}>下一方法<ArrowRight size={15}/></button></nav>
  </aside>;
}

function DetailList({ title, tone, items }: { title: string; tone: "good" | "neutral" | "warning" | "danger" | "alternative"; items: string[] }) {
  return <section className={`method-detail ${tone}`}><h3>{tone === "warning" || tone === "danger" ? <AlertTriangle size={15}/> : null}{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>;
}
