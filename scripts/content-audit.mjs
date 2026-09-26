import { chapters, lessons, stages, totalExercises, totalUnits } from "../lib/curriculum.ts";
import { methodCategories, methodNodes } from "../lib/method-graph.ts";

const errors=[];
const expected=[7,8,7,7,6,9,9,11,8,7,7,7,9,7,6,7,6,8,7,8,8,8,7,6];
const normalize=s=>s.replace(/[\s，。；：、“”‘’（）()《》·—…,.!?！？:;\-]/g,"").toLowerCase();
const duplicates=items=>items.length-new Set(items.map(normalize)).size;
const forbidden=["这个案例中，研究者需要把","第一步写出研究问题和目标量","本课聚焦","从直觉到实践","输出应包含核心估计、诊断或模拟分布"];

if(stages.length!==3) errors.push(`学习阶段应为3，实际${stages.length}`);
if(chapters.length!==24) errors.push(`章节应为24，实际${chapters.length}`);
if(totalUnits!==60) errors.push(`单元应为60，实际${totalUnits}`);
if(lessons.length!==180) errors.push(`课程应为180，实际${lessons.length}`);
if(totalExercises!==1800) errors.push(`练习应为1800，实际${totalExercises}`);
if(methodCategories.length!==7) errors.push(`方法图谱分类应为7，实际${methodCategories.length}`);

const ids=new Set();
const allPro=[];
const allKid=[];
lessons.forEach(lesson=>{
  if(ids.has(lesson.id)) errors.push(`重复课时ID ${lesson.id}`);
  ids.add(lesson.id);
  const expectedId=`c${String(lesson.chapterId).padStart(2,"0")}-l${String(lesson.order).padStart(2,"0")}`;
  if(lesson.id!==expectedId) errors.push(`${lesson.id} 与章节顺序不一致`);
  if(lesson.title.includes("从直觉到实践")) errors.push(`${lesson.id} 保留了旧模板标题`);
  if(lesson.objectives.length<4||lesson.prerequisites.length<1) errors.push(`${lesson.id} 学习目标或先修知识不足`);
  if(lesson.sections.length!==6) errors.push(`${lesson.id} 应有6个正文小节`);
  const pro=lesson.sections.flatMap(section=>section.pro);
  const kid=lesson.sections.flatMap(section=>section.kid);
  if(pro.some(x=>!x.trim())||kid.some(x=>!x.trim())) errors.push(`${lesson.id} 双版本存在空段落`);
  if(duplicates(pro)>0||duplicates(kid)>0) errors.push(`${lesson.id} 课内正文出现重复段落`);
  if([...pro,...kid].some(p=>forbidden.some(x=>p.includes(x)))) errors.push(`${lesson.id} 含旧模板措辞`);
  allPro.push(...pro); allKid.push(...kid);
  const rawCase=lesson.caseStudy.replace(/^[^：]+案例：/,"");
  if([...pro,...kid].some(p=>p.includes(rawCase))) errors.push(`${lesson.id} 在正文重复完整案例；案例只能在例题出现`);
  if(lesson.workedExample.question!==lesson.caseStudy) errors.push(`${lesson.id} 例题与案例索引不一致`);
  if(lesson.formula&&!lesson.symbolNotes.length) errors.push(`${lesson.id} 有公式但没有符号与条件说明`);
  if(!lesson.formula&&lesson.symbolNotes.length) errors.push(`${lesson.id} 无公式却保留符号框`);
  if(lesson.comparison.length<3||new Set(lesson.comparison.map(x=>x.method)).size!==lesson.comparison.length) errors.push(`${lesson.id} 方法比较不足或重复`);
  if(lesson.references.length<3||lesson.glossary.length<1) errors.push(`${lesson.id} 引用或术语不足`);
  if(lesson.exercises.length!==10) errors.push(`${lesson.id} 练习不是10题`);
  const levels=lesson.exercises.map(x=>x.level);
  if(levels.filter(x=>x==="简单").length!==4||levels.filter(x=>x==="中等").length!==4||levels.filter(x=>x==="困难").length!==2) errors.push(`${lesson.id} 难度配比错误`);
  if(duplicates(lesson.exercises.map(x=>x.prompt))>0) errors.push(`${lesson.id} 有重复题干`);
  lesson.exercises.forEach(ex=>{
    if(ex.solution.steps.length<3||duplicates(ex.solution.steps)>0) errors.push(`${ex.id} 步骤不足或重复`);
    if(!ex.solution.idea||!ex.solution.result||!ex.solution.pitfalls||!ex.solution.kid) errors.push(`${ex.id} 解析不完整`);
  });
  const codeExercises=lesson.exercises.filter(x=>x.type==="代码");
  if(lesson.codeLab){
    for(const key of ["purpose","data","code","expectedOutput","interpretation","diagnostics"]) if(!lesson.codeLab[key]?.trim()) errors.push(`${lesson.id} 代码实验缺少${key}`);
    if(codeExercises.length!==1) errors.push(`${lesson.id} 有代码实验但代码题数量不是1`);
    if(/\b(df|X|y)\b/.test(lesson.codeLab.code)&&!/\b(df|X|y)\s*=/.test(lesson.codeLab.code)) errors.push(`${lesson.id} 代码引用了未定义的df/X/y`);
  } else if(codeExercises.length||lesson.exercises.some(x=>x.solution.code)) errors.push(`${lesson.id} 无代码实验却生成代码题`);
  if(lesson.chapterId>=18&&!lesson.openTask) errors.push(`${lesson.id} 缺少博士开放任务`);
});

chapters.forEach((chapter,index)=>{
  if(chapter.lessonIds.length!==expected[index]) errors.push(`第${chapter.id}章课时数错误`);
  if(chapter.units.some(unit=>unit.lessonIds.length===0)) errors.push(`第${chapter.id}章存在空单元`);
  const covered=lessons.filter(x=>x.chapterId===chapter.id).flatMap(x=>x.focus);
  const missing=chapter.topics.filter(topic=>!covered.includes(topic));
  if(missing.length) errors.push(`第${chapter.id}章遗漏主题：${missing.join("、")}`);
});
if(duplicates(allPro)>0) errors.push(`专业版存在${duplicates(allPro)}个完全重复段落`);
if(duplicates(allKid)>0) errors.push(`宝宝版存在${duplicates(allKid)}个完全重复段落`);

const graphIds=new Set();
const branchIds=new Set();
methodCategories.forEach(category=>{
  if(graphIds.has(category.id)) errors.push(`方法图谱重复分类ID ${category.id}`);
  graphIds.add(category.id);
  if(!category.branches.length) errors.push(`方法图谱分类 ${category.id} 没有判断分支`);
  category.branches.forEach(branch=>{
    if(branchIds.has(branch.id)) errors.push(`方法图谱重复分支ID ${branch.id}`);
    branchIds.add(branch.id);
    if(!branch.methods.length) errors.push(`方法图谱分支 ${branch.id} 是孤立节点`);
  });
});
methodNodes.forEach(method=>{
  if(graphIds.has(method.id)) errors.push(`方法图谱重复节点ID ${method.id}`);
  graphIds.add(method.id);
  if(!ids.has(method.lessonId)) errors.push(`${method.id} 指向不存在的课时 ${method.lessonId}`);
  for(const key of ["data","summary"]) if(!method[key]?.trim()) errors.push(`${method.id} 缺少${key}`);
  for(const key of ["useWhen","assumptions","avoidWhen","mistakes","alternatives","keywords"]) if(!method[key]?.length) errors.push(`${method.id} 缺少${key}`);
  if(method.mode==="formula"){
    if(!method.formula?.expression||!method.formula.symbols.length) errors.push(`${method.id} 公式或符号解释不完整`);
    if(method.process) errors.push(`${method.id} 公式节点混入分析流程`);
  } else {
    if(method.formula) errors.push(`${method.id} 非公式节点不应显示公式`);
    if(!method.process?.length||method.process[0]!=="本方法依靠分析流程，不以单一公式作判断。") errors.push(`${method.id} 缺少无公式声明或分析流程`);
  }
});

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`严格内容审计通过：${stages.length}阶段、${chapters.length}章、${totalUnits}单元、${lessons.length}课、${totalExercises}题；正文无完全重复段落；${methodCategories.length}类、${methodNodes.length}个方法图谱节点全部有效。`);
