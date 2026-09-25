import { chapters as sourceChapters, type Chapter as SourceChapter } from "./course-data.ts";

export type Difficulty = "入门" | "进阶" | "高阶";
export type ExerciseLevel = "简单" | "中等" | "困难";

export type LessonSection = {
  id: string;
  title: string;
  pro: string[];
  kid: string[];
};

export type Exercise = {
  id: string;
  level: ExerciseLevel;
  type: "概念" | "判断" | "计算" | "方法选择" | "结果解释" | "纠错" | "代码" | "研究设计";
  prompt: string;
  solution: { idea: string; steps: string[]; result: string; pitfalls: string; kid: string; code?: string };
};

export type Lesson = {
  id: string;
  chapterId: number;
  order: number;
  unitId: string;
  title: string;
  focus: string[];
  difficulty: Difficulty;
  minutes: number;
  objectives: string[];
  prerequisites: string[];
  keywords: string[];
  sections: LessonSection[];
  formula: string;
  symbolNotes: string[];
  comparison: { method: string; bestFor: string; strength: string; limit: string }[];
  workedExample: { question: string; steps: string[]; answer: string };
  caseStudy: string;
  python: string;
  expectedOutput: string;
  reportTemplate: string;
  glossary: { term: string; meaning: string }[];
  references: string[];
  exercises: Exercise[];
  openTask?: { prompt: string; rubric: string[]; example: string; defects: string[] };
};

export type Unit = { id: string; title: string; objective: string; lessonIds: string[] };
export type Chapter = Omit<SourceChapter, "professional" | "plain" | "python"> & {
  summary: string;
  units: Unit[];
  lessonIds: string[];
};

export type LearningStage = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  chapterIds: number[];
  color: string;
};

const lessonCounts = [7, 8, 7, 7, 6, 9, 9, 11, 8, 7, 7, 7, 9, 7, 6, 7, 6, 8, 7, 8, 8, 8, 7, 6];
const numerals = ["一", "二", "三", "四", "五", "六", "七", "八"];

export const stages: LearningStage[] = [
  { id: "foundation", eyebrow: "STAGE 01", title: "概率与数理统计", description: "从随机性、分布和抽样出发，建立检验、估计与回归的共同语言。", chapterIds: [1,2,3,4,5,6,7,8,9], color: "#19736d" },
  { id: "social", eyebrow: "STAGE 02", title: "社会科学量化实践", description: "把模型放回研究设计、测量、因果、纵向资料和可复现工作流。", chapterIds: [10,11,12,13,14,15,16,17], color: "#ba6438" },
  { id: "doctoral", eyebrow: "STAGE 03", title: "博士研究方法", description: "覆盖质性、混合研究、高级推断、证据综合与博士论文完整实践。", chapterIds: [18,19,20,21,22,23,24], color: "#6b5794" },
];

function distribute<T>(items: T[], count: number): T[][] {
  return Array.from({ length: count }, (_, i) => {
    const start = Math.floor(i * items.length / count);
    const end = Math.floor((i + 1) * items.length / count);
    return items.slice(start, Math.max(start + 1, end));
  });
}

function makeSections(chapter: SourceChapter, focus: string[]): LessonSection[] {
  const topic = focus.join("、");
  const qualitative = chapter.id === 18 || chapter.id === 19 || (chapter.id === 24 && /质性|混合|理论/.test(topic));
  const blocks = [
    ["问题从哪里来", `本课聚焦${topic}。它不是孤立术语，而是用来处理“${chapter.useWhen}”这一类研究判断。先界定分析单位、资料如何产生以及希望得到描述、解释、预测还是因果结论，才能决定这一方法是否真的适用。`, `把研究想成侦探办案：${topic}是一件工具。先说清要找什么证据，再拿工具；不能因为软件里有按钮就反过来编问题。`],
    ["核心概念与逻辑", `${chapter.professional} 在本课中需要特别区分${focus[0]}的定义、可观察信息与不可直接观察的目标。专业判断应把概念层、测量层和分析层分开，避免把一个计算结果误写成理论事实。`, `${chapter.plain} 简单说，先给每个词贴好标签：它在说谁、看什么、最后能知道多少。名字相似的工具，也可能回答完全不同的问题。`],
    [qualitative ? "资料与分析步骤" : "公式、假设与推导", qualitative ? `分析从资料片段开始，依次记录初步解释、比较相似与相反材料、形成范畴，并用备忘录保存判断如何变化。研究者必须保留反例、抽样决策和版本记录，使读者能够追踪从原始资料到结论的路径。` : `核心表达为 ${chapter.formula}。推导时先写清每个符号对应的总体、样本或条件，再从定义代入。成立条件包括抽样机制与模型结构；若独立性、分布、线性或正值性等条件不满足，标准误和结论范围都可能改变。`, qualitative ? `像整理一大盒故事卡：先给每张卡写短标签，再把相似卡放成小组，同时专门寻找“不合群”的卡。每次合并都写下原因，这样别人才能看懂你的理论是怎样长出来的。` : `公式像食谱，不是咒语。每个字母都是一种材料，假设是烹饪条件。漏掉条件，即使算式按对了，也可能做出不能吃的结论。`],
    ["完整操作流程", `第一步写出研究问题和目标量；第二步检查${topic}需要的变量、资料层级和时间顺序；第三步完成描述与诊断；第四步运行主要分析；第五步报告效应大小、不确定性和限制；第六步使用替代设定、重采样或负面案例检验结论是否稳健。`, `按六格清单做：问什么、看谁、用什么资料、怎么算或怎么编码、结果有多确定、哪里还可能错。少一格，就先停下来补齐。`],
    ["与相邻方法怎么选", `${chapter.advantage} 但它并非默认优于所有替代方案。选择时比较研究问题、结果变量类型、样本结构、时间结构、识别假设与解释目标；如果更简单的方法已经回答问题，应优先选择可审计且便于解释的方案。`, `高级方法不一定更好。像选交通工具：过河要船，上楼要楼梯。真正的优势是刚好匹配问题，而且你能说明为什么没选其他工具。`],
    ["误区、报告与下一步", `最常见错误是：${chapter.caution} 报告时应同时给出资料来源、样本或材料筛选、估计或编码规则、诊断、主要结果、敏感性分析和证据边界。结论必须保持在设计允许的范围内。`, `不要只写“显著”“发现一个主题”或“模型准确”。要告诉读者资料从哪来、怎么处理、结果差多少、可能错在哪，以及哪些话现在还不能说。`],
  ];
  return blocks.map((b, i) => ({ id: `s${i + 1}`, title: b[0], pro: [b[1], `${chapter.caseStudy} 这个案例中，研究者需要把“${topic}”转换为可观察、可检查的判断，并明确哪些信息来自资料，哪些信息来自理论假设。`], kid: [b[2], `小练习：试着用一句日常语言解释“${focus[0]}”，再举一个不能使用它的反例。`] }));
}

function makeExercises(lessonId: string, chapter: SourceChapter, focus: string[]): Exercise[] {
  const a = focus[0];
  const b = focus[1] ?? chapter.topics[(chapter.topics.indexOf(a) + 1) % chapter.topics.length];
  const levels: ExerciseLevel[] = ["简单","简单","简单","简单","中等","中等","中等","中等","困难","困难"];
  const types: Exercise["type"][] = ["概念","判断","概念","方法选择","计算","结果解释","纠错","代码","研究设计","方法选择"];
  const prompts = [
    `用自己的话定义“${a}”，并说明它回答的研究问题。`,
    `判断并解释：“只要样本足够大，${a}的所有前提都可以忽略。”`,
    `比较${a}与${b}：二者的输入信息和结论范围分别是什么？`,
    `案例“${chapter.caseStudy}”中，什么时候应优先考虑${a}？`,
    `围绕 ${chapter.formula} 写出符号含义，并展示一次从条件到结论的计算或推理。`,
    `若分析得到很小的 p 值、很高的拟合度或高度一致的编码，应怎样避免过度解释？`,
    `找出错误：“${a}结果支持研究假设，因此已证明理论必然正确。”并改写。`,
    `阅读本课 Python 示例，指出输入、主要运算、输出以及至少一项诊断。`,
    `为“${chapter.caseStudy}”写一份最小可执行研究方案，明确样本、变量或资料、分析和伦理。`,
    `设计一个会使${a}结论失效的反例，并提出稳健性或敏感性检查。`,
  ];
  return prompts.map((prompt, i) => ({
    id: `${lessonId}-q${i + 1}`, level: levels[i], type: types[i], prompt,
    solution: {
      idea: i < 4 ? `先把${a}从公式或术语翻译为它实际处理的对象，再说明用途与边界。` : `先重建资料生成过程，再判断${a}的条件是否满足，最后把计算结果翻译回研究问题。`,
      steps: i === 1 ? ["识别绝对化表述“所有前提”", "区分大样本能改善的精度与不能修复的系统偏差", "给出反例并改写"] : ["写出研究问题与分析单位", `说明${a}所需信息和关键假设`, "完成计算、比较或编码判断", "报告不确定性、替代解释与证据边界"],
      result: i === 1 ? `该说法错误。大样本可降低部分抽样误差，却不能自动修复选择偏差、测量错误、模型错设或伦理问题。` : `合格答案必须把“${a}”与案例中的资料和目标对应，并避免超出设计范围。`,
      pitfalls: `不要只复述定义、只报显著性，也不要把${a}与${b}当成可以无条件互换的菜单选项。`,
      kid: `先问“我想知道什么”，再问“手里的证据够不够”。算得很精确，不代表一开始拿到的证据就是对的。`,
      ...(i === 7 ? { code: chapter.python } : {}),
    },
  }));
}

function makeLesson(chapter: SourceChapter, focus: string[], order: number, unitId: string): Lesson {
  const id = `c${String(chapter.id).padStart(2,"0")}-l${String(order).padStart(2,"0")}`;
  const title = focus.length === 1 ? `${focus[0]}：从直觉到实践` : `${focus[0]}与${focus.slice(1).join("、")}`;
  const qualitative = chapter.id === 18 || chapter.id === 19;
  return {
    id, chapterId: chapter.id, order, unitId, title, focus,
    difficulty: chapter.id <= 6 ? "入门" : chapter.id <= 17 ? "进阶" : "高阶",
    minutes: 25 + (order % 5) * 5,
    objectives: [`准确解释${focus[0]}及其研究用途`, `判断${focus[0]}的适用条件与证据边界`, `比较${focus[0]}与${focus[1] ?? "相邻方法"}`, "完成一个从问题到报告的案例", "识别至少两种常见误用"],
    prerequisites: order === 1 ? [chapter.id === 1 ? "高中代数与集合直觉" : `第 ${Math.max(1, chapter.id - 1)} 章核心概念`] : [`本章第 ${order - 1} 课`],
    keywords: [...focus, chapter.title, chapter.part],
    sections: makeSections(chapter, focus), formula: chapter.formula,
    symbolNotes: qualitative ? ["资料片段：分析的最小上下文单位", "编码：对片段的暂时性解释", "范畴：多个编码之间更抽象的关系"] : ["总体参数：希望了解但通常不能直接观察的量", "统计量：由样本计算、用于推断总体的量", "标准误：统计量在重复抽样中的波动尺度"],
    comparison: [
      { method: focus[0], bestFor: chapter.useWhen, strength: chapter.advantage, limit: chapter.caution },
      { method: focus[1] ?? "描述性分析", bestFor: "先理解资料形态与基本差异", strength: "透明、假设较少、容易审计", limit: "通常不能独立完成复杂推断" },
      { method: "稳健或非参数替代", bestFor: "常规分布或模型条件明显不满足", strength: "降低对特定模型形式的依赖", limit: "回答的目标量可能不同，效率也可能下降" },
    ],
    workedExample: { question: chapter.caseStudy, steps: ["明确研究对象、分析单位与目标结论", `把${focus.join("、")}映射为变量、事件、编码或模型部件`, "写出假设并检查资料是否支持", "完成核心计算或持续比较", "用效应、不确定性和限制回答原问题"], answer: `本例应使用${focus[0]}组织分析，但结论仅适用于样本与设计覆盖的范围。${chapter.caution}` },
    caseStudy: chapter.caseStudy, python: chapter.python,
    expectedOutput: qualitative ? "输出编码频数仅用于资料管理；理论关系仍需回到上下文与反例判断。" : "输出应包含核心估计、诊断或模拟分布；具体数值会随数据和随机种子变化。",
    reportTemplate: `“我们使用${focus[0]}回答……。资料来自……，分析单位为……。主要假设通过……检查。结果显示……（报告效应与不确定性）。替代设定……得到一致/不一致结果。由于……，本研究不能推出……。”`,
    glossary: focus.slice(0,4).map((term, i) => ({ term, meaning: i === 0 ? `本课核心概念，用于${chapter.useWhen}` : `与${focus[0]}配合使用的关键术语；需结合本章定义判断。` })),
    references: ["茆诗松等：《概率论与数理统计教程》", "Alan Agresti: Statistical Methods for the Social Sciences", chapter.id >= 18 ? "Creswell & Poth: Qualitative Inquiry and Research Design" : "APA Journal Article Reporting Standards"],
    exercises: makeExercises(id, chapter, focus),
    ...(chapter.id >= 18 ? { openTask: { prompt: `围绕${focus.join("、")}设计一项可审查的博士级研究任务。`, rubric: ["问题与方法匹配", "资料与抽样透明", "分析决策可追踪", "反例或敏感性检查", "伦理与证据边界明确"], example: `优秀方案会从${chapter.caseStudy}出发，给出具体资料、决策路径和冲突证据的处理规则。`, defects: ["只罗列方法名称", "没有负面案例或替代解释", "把复杂模型当作理论贡献", "忽略隐私和研究者位置"] } } : {}),
  };
}

const allLessons: Lesson[] = [];
export const chapters: Chapter[] = sourceChapters.map((chapter, index) => {
  const count = lessonCounts[index];
  const focuses = distribute(chapter.topics, count);
  const unitCount = chapter.id <= 12 ? 3 : 2;
  const unitFocuses = distribute(focuses, unitCount);
  const units: Unit[] = [];
  let cursor = 0;
  unitFocuses.forEach((lessonFocuses, unitIndex) => {
    const unitId = `c${String(chapter.id).padStart(2,"0")}-u${unitIndex + 1}`;
    const ids: string[] = [];
    lessonFocuses.forEach((focus) => {
      cursor += 1;
      const lesson = makeLesson(chapter, focus, cursor, unitId);
      allLessons.push(lesson); ids.push(lesson.id);
    });
    units.push({ id: unitId, title: `单元${numerals[unitIndex]} · ${lessonFocuses[0][0]}${lessonFocuses.length > 1 ? `到${lessonFocuses.at(-1)?.[0]}` : ""}`, objective: `完成本单元后，能够把${lessonFocuses.flat().slice(0,3).join("、")}用于真实研究判断。`, lessonIds: ids });
  });
  return { id: chapter.id, part: chapter.part, title: chapter.title, level: chapter.level, topics: chapter.topics, useWhen: chapter.useWhen, advantage: chapter.advantage, caution: chapter.caution, formula: chapter.formula, caseStudy: chapter.caseStudy, summary: chapter.professional, units, lessonIds: units.flatMap(u => u.lessonIds) };
});

export const lessons = allLessons;
export const lessonMap = new Map(lessons.map(lesson => [lesson.id, lesson]));
export const chapterMap = new Map(chapters.map(chapter => [chapter.id, chapter]));
export const totalUnits = chapters.reduce((sum, chapter) => sum + chapter.units.length, 0);
export const totalExercises = lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0);

export const learningPaths = [
  { title: "数理统计基础", description: "零起点到检验与回归", chapters: [1,2,4,5,6,7,8,9] },
  { title: "心理测量", description: "量表、潜变量与纵向变化", chapters: [10,12,14,21] },
  { title: "社会学量化", description: "调查、分类结果、多层与网络", chapters: [10,11,14,16] },
  { title: "因果推断", description: "从实验设计到高级识别", chapters: [13,20] },
  { title: "质性与混合研究", description: "扎根、民族志与证据整合", chapters: [18,19,24] },
  { title: "博士论文", description: "高级建模、综述与完整研究实践", chapters: [20,21,22,23,24] },
];
