export type MethodMode = "formula" | "process";

export type FormulaSpec = {
  expression: string;
  symbols: string[];
};

export type MethodNode = {
  id: string;
  title: string;
  mode: MethodMode;
  summary: string;
  data: string;
  useWhen: string[];
  assumptions: string[];
  avoidWhen: string[];
  mistakes: string[];
  alternatives: string[];
  formula?: FormulaSpec;
  process?: string[];
  lessonId: string;
  keywords: string[];
};

export type MethodBranch = {
  id: string;
  title: string;
  question: string;
  methods: MethodNode[];
};

export type MethodCategory = {
  id: string;
  shortTitle: string;
  title: string;
  description: string;
  color: string;
  rootQuestion: string;
  branches: MethodBranch[];
};

const noFormula = "本方法依靠分析流程，不以单一公式作判断。";

export const methodCategories: MethodCategory[] = [
  {
    id: "probability",
    shortTitle: "概率分布",
    title: "概率与随机变量",
    description: "先判断结果怎样产生，再选择概率规则或分布。",
    color: "#19736d",
    rootQuestion: "你是在更新概率，还是描述随机结果的分布？",
    branches: [
      {
        id: "probability-update",
        title: "信息更新",
        question: "已知新证据后，事件概率怎样变化？",
        methods: [
          {
            id: "conditional-probability",
            title: "条件概率",
            mode: "formula",
            summary: "在事件 B 已经发生的条件下，重新计算事件 A 的概率。",
            data: "能够明确界定 A、B 及其交集的随机试验或频数资料。",
            useWhen: ["样本空间因已知信息而缩小", "需要区分联合概率与条件概率"],
            assumptions: ["P(B)>0", "A、B 的定义和观察窗口固定"],
            avoidWhen: ["B 的发生由结果 A 之后的信息定义", "把 P(A|B) 误当成 P(B|A)"],
            mistakes: ["忽略分母应是 P(B)", "条件改变后仍沿用原样本空间"],
            alternatives: ["若需要由结果反推原因，继续使用贝叶斯公式", "若事件互斥且只求并集，使用加法公式"],
            formula: { expression: "P(A|B) = P(A∩B) / P(B)", symbols: ["A：目标事件", "B：已知条件，且 P(B)>0", "A∩B：两事件同时发生"] },
            lessonId: "c01-l06",
            keywords: ["条件概率", "联合概率", "样本空间"]
          },
          {
            id: "bayes-rule",
            title: "贝叶斯公式",
            mode: "formula",
            summary: "把先验概率与证据的似然结合，得到观察证据后的后验概率。",
            data: "互斥且完备的原因类别，以及各类别的先验概率与条件概率。",
            useWhen: ["由检测结果反推真实状态", "需要根据新证据更新分类判断"],
            assumptions: ["原因类别覆盖全部可能且互斥", "条件概率来源可靠，分母不为零"],
            avoidWhen: ["先验概率无法合理给定且结论对其极敏感", "把后验概率解释为确定事实"],
            mistakes: ["忽略基础发生率", "只比较似然而不归一化"],
            alternatives: ["只有一个条件事件时先用条件概率", "连续参数推断可进入贝叶斯统计"],
            formula: { expression: "P(Aᵢ|B) = P(B|Aᵢ)P(Aᵢ) / ΣⱼP(B|Aⱼ)P(Aⱼ)", symbols: ["Aᵢ：第 i 个可能原因", "B：已经观察到的证据", "P(Aᵢ)：先验概率", "P(B|Aᵢ)：似然"] },
            lessonId: "c01-l07",
            keywords: ["贝叶斯", "先验", "后验", "基础率"]
          }
        ]
      },
      {
        id: "probability-discrete",
        title: "离散结果",
        question: "结果是二元试验次数，还是单位区间内的事件计数？",
        methods: [
          {
            id: "binomial-distribution",
            title: "二项分布",
            mode: "formula",
            summary: "描述 n 次独立、成功概率相同的二元试验中成功次数。",
            data: "固定试验次数 n，每次结果只有成功/失败。",
            useWhen: ["统计固定人数中的成功人数", "每次试验成功概率近似相同"],
            assumptions: ["试验相互独立", "n 固定且每次 p 相同"],
            avoidWhen: ["事件率随个体或时间明显变化", "计数没有固定试验次数"],
            mistakes: ["把不放回小总体抽样当成独立试验", "把人数比例和成功次数混为一谈"],
            alternatives: ["稀有事件率计数可考虑 Poisson 分布", "不放回有限总体使用超几何分布"],
            formula: { expression: "P(X=k)=C(n,k)pᵏ(1-p)ⁿ⁻ᵏ", symbols: ["n：独立试验次数", "k：成功次数", "p：每次成功概率"] },
            lessonId: "c02-l05",
            keywords: ["二项分布", "Bernoulli", "成功次数"]
          },
          {
            id: "poisson-distribution",
            title: "Poisson 分布",
            mode: "formula",
            summary: "描述固定时间、空间或暴露量内独立事件的发生次数。",
            data: "非负整数计数，并有明确的观察区间或暴露量。",
            useWhen: ["统计一段时间内的事件次数", "事件稀疏且平均发生率相对稳定"],
            assumptions: ["不相交区间的计数近似独立", "同一尺度上的发生率 λ 稳定"],
            avoidWhen: ["方差远大于均值", "大量结构性零值或事件相互激发"],
            mistakes: ["遗漏不同观察时长的暴露量", "看到计数就默认 Poisson"],
            alternatives: ["过度离散使用负二项分布", "大量额外零值使用零膨胀模型"],
            formula: { expression: "P(X=k)=e⁻λλᵏ/k!", symbols: ["k：观察到的事件次数", "λ：给定区间内的平均事件数", "e：自然常数"] },
            lessonId: "c02-l06",
            keywords: ["Poisson", "计数", "事件率"]
          }
        ]
      },
      {
        id: "probability-continuous",
        title: "连续结果",
        question: "连续变量围绕中心波动，还是等待事件发生？",
        methods: [
          {
            id: "normal-distribution",
            title: "正态分布",
            mode: "formula",
            summary: "用均值和标准差描述对称、单峰的连续变量分布。",
            data: "连续测量值，或由许多微小独立因素共同形成的总和。",
            useWhen: ["变量分布近似对称钟形", "标准化后需要计算区间概率"],
            assumptions: ["分布近似对称且尾部不过重", "观测来自同一稳定生成机制"],
            avoidWhen: ["明显偏态、厚尾或多峰", "用正态性替代对抽样机制的检查"],
            mistakes: ["认为所有连续变量都正态", "把密度值当作点概率"],
            alternatives: ["偏态正值资料可考虑对数正态或 Gamma", "只需稳健描述时使用中位数和四分位距"],
            formula: { expression: "f(x)=1/(σ√(2π))·exp[-(x-μ)²/(2σ²)]", symbols: ["μ：分布均值", "σ：标准差且 σ>0", "f(x)：概率密度，不是点概率"] },
            lessonId: "c02-l08",
            keywords: ["正态分布", "Z分数", "概率密度"]
          },
          {
            id: "exponential-distribution",
            title: "指数分布",
            mode: "formula",
            summary: "描述恒定事件率下，等待下一次事件发生的时间。",
            data: "非负连续等待时间。",
            useWhen: ["事件发生率近似恒定", "关注首次事件的等待时长"],
            assumptions: ["无记忆性合理", "观察期间发生率 λ 不随时间变化"],
            avoidWhen: ["风险率随时间系统变化", "存在删失且需要协变量解释"],
            mistakes: ["把 λ 当作平均等待时间", "忽略删失资料"],
            alternatives: ["风险随时间变化时用 Weibull", "包含协变量和删失时用 Cox 模型"],
            formula: { expression: "f(t)=λe⁻ˡᵗ, t≥0；E(T)=1/λ", symbols: ["T：等待时间", "λ：单位时间事件率", "1/λ：平均等待时间"] },
            lessonId: "c02-l07",
            keywords: ["指数分布", "等待时间", "无记忆性"]
          }
        ]
      }
    ]
  },
  {
    id: "description",
    shortTitle: "描述抽样",
    title: "描述统计与抽样",
    description: "先看变量分布与抽样方式，再决定怎样概括和表达不确定性。",
    color: "#8a6b25",
    rootQuestion: "你要描述现有样本，还是从样本推断总体？",
    branches: [
      {
        id: "description-center",
        title: "概括分布",
        question: "你关心中心、离散程度，还是分布形状？",
        methods: [
          {
            id: "mean-median",
            title: "均值与中位数",
            mode: "formula",
            summary: "均值利用全部数值，中位数用排序后的中央位置描述典型水平。",
            data: "至少为有序数据；均值通常要求间隔尺度具有实质意义。",
            useWhen: ["对称分布用均值概括中心", "偏态或离群值明显时优先中位数"],
            assumptions: ["观测单位定义一致", "均值比较时量尺和总体具有可比性"],
            avoidWhen: ["无序类别变量", "用均值掩盖双峰或严重异质性"],
            mistakes: ["只报均值不看分布", "把 Likert 单题均值解释得过细"],
            alternatives: ["类别变量报告频数和比例", "多峰分布分组报告或画密度图"],
            formula: { expression: "x̄ = Σxᵢ/n；Median = 排序后的中央位置", symbols: ["xᵢ：第 i 个观测", "n：有效观测数", "x̄：样本均值"] },
            lessonId: "c06-l06",
            keywords: ["均值", "中位数", "集中趋势"]
          },
          {
            id: "variance-iqr",
            title: "方差、标准差与四分位距",
            mode: "formula",
            summary: "标准差描述相对均值的典型波动，四分位距稳健描述中间一半资料。",
            data: "数值型变量；四分位距也适合有序、偏态资料。",
            useWhen: ["均值有意义时配套报告标准差", "偏态或有离群值时报告四分位距"],
            assumptions: ["样本方差使用 n-1 校正", "比较组间离散度时量尺一致"],
            avoidWhen: ["无序类别资料", "只凭标准差判断正态性"],
            mistakes: ["混淆标准差与标准误", "把方差单位当作原变量单位"],
            alternatives: ["相对离散程度可用变异系数", "完整形状配合箱线图或密度图"],
            formula: { expression: "s²=Σ(xᵢ-x̄)²/(n-1)；s=√s²；IQR=Q₃-Q₁", symbols: ["s²：样本方差", "s：样本标准差", "Q₁、Q₃：第一、第三四分位数"] },
            lessonId: "c06-l07",
            keywords: ["方差", "标准差", "四分位距"]
          },
          {
            id: "histogram-boxplot",
            title: "直方图与箱线图",
            mode: "process",
            summary: "用图形检查偏态、多峰、离群点和组间分布差异。",
            data: "连续或近似连续的数值变量，可按研究组分面。",
            useWhen: ["分析前检查分布形状", "比较多个组的中位数、离散与异常值"],
            assumptions: ["组距选择透明", "异常值规则只用于标记，不自动删除"],
            avoidWhen: ["样本极小时把平滑形状当作真实总体", "仅凭箱线图判定观测错误"],
            mistakes: ["改变组距制造想要的形状", "把箱线图须线外点全部删除"],
            alternatives: ["小样本叠加原始散点", "需要概率结构时使用经验分布函数"],
            process: [noFormula, "确认变量尺度与缺失值", "同时查看原始点、直方图或箱线图", "记录偏态、多峰、边界和异常来源", "再决定变换、稳健方法或分组分析"],
            lessonId: "c06-l04",
            keywords: ["直方图", "箱线图", "分布诊断"]
          }
        ]
      },
      {
        id: "description-uncertainty",
        title: "抽样不确定性",
        question: "你要表达估计的标准误，还是构造总体参数区间？",
        methods: [
          {
            id: "standard-error",
            title: "均值的标准误",
            mode: "formula",
            summary: "描述重复抽样时样本均值会波动多大，而不是个体值的离散程度。",
            data: "独立随机样本中的数值型变量。",
            useWhen: ["需要量化样本均值的抽样精度", "构造均值置信区间"],
            assumptions: ["样本单位近似独立", "复杂抽样时使用相应设计标准误"],
            avoidWhen: ["把标准误当作样本内部差异", "聚类数据仍使用简单随机抽样公式"],
            mistakes: ["混淆 SD 与 SE", "通过增大样本把实质差异包装为重要"],
            alternatives: ["复杂抽样使用加权或聚类标准误", "未知解析分布时考虑 Bootstrap"],
            formula: { expression: "SE(x̄)=s/√n", symbols: ["s：样本标准差", "n：独立样本量", "SE：均值抽样分布的估计标准差"] },
            lessonId: "c06-l06",
            keywords: ["标准误", "抽样分布", "精度"]
          },
          {
            id: "confidence-interval",
            title: "均值置信区间",
            mode: "formula",
            summary: "用具有明确长期覆盖率的区间表达总体均值估计的不确定性。",
            data: "独立数值样本；总体标准差通常未知。",
            useWhen: ["报告总体均值的可能范围", "同时关心效应方向、大小与精度"],
            assumptions: ["样本独立且抽样机制可辩护", "小样本时总体近似正态或无强离群"],
            avoidWhen: ["把95%置信区间解释为参数有95%概率在其中", "选择偏差严重却只增加区间宽度"],
            mistakes: ["只看是否跨零，不解释效应大小", "误用 z 临界值处理小样本未知方差"],
            alternatives: ["比例使用相应比例区间", "分布复杂时使用合适的 Bootstrap 区间"],
            formula: { expression: "x̄ ± t₁₋α/₂,ₙ₋₁ · s/√n", symbols: ["x̄：样本均值", "t：t 分布临界值", "α：错误覆盖率", "n-1：自由度"] },
            lessonId: "c07-l08",
            keywords: ["置信区间", "t分布", "区间估计"]
          },
          {
            id: "bootstrap-interval",
            title: "Bootstrap 区间",
            mode: "formula",
            summary: "从经验样本反复有放回重抽，近似统计量的抽样分布。",
            data: "能够代表目标总体的原始观测，且抽样单位可正确重抽。",
            useWhen: ["统计量标准误难以解析推导", "需要为中位数、间接效应等构造区间"],
            assumptions: ["原样本对目标总体有代表性", "重抽单位尊重配对、聚类或时间结构"],
            avoidWhen: ["样本极小且尾部事件从未出现", "有依赖结构却逐行独立重抽"],
            mistakes: ["把重复次数当作新增样本量", "忽略 percentile、basic 与 BCa 区间差异"],
            alternatives: ["有已知抽样分布时使用解析区间", "检验零假设可使用置换检验"],
            formula: { expression: "θ̂*ᵇ = T(X*ᵇ)，CIₚ=[Q*α/₂, Q*₁₋α/₂]", symbols: ["X*ᵇ：第 b 次有放回重抽样本", "T：目标统计量", "Q*：Bootstrap 统计量分位数"] },
            lessonId: "c07-l09",
            keywords: ["Bootstrap", "重抽样", "区间"]
          }
        ]
      }
    ]
  },
  {
    id: "testing",
    shortTitle: "估计检验",
    title: "参数估计与假设检验",
    description: "由结局尺度、组数、样本关系和分布条件选择检验。",
    color: "#ba6438",
    rootQuestion: "结局是什么尺度，比较几组，观测是否配对？",
    branches: [
      {
        id: "testing-means",
        title: "比较均值",
        question: "是一组对参照、两组独立，还是同一对象前后比较？",
        methods: [
          {
            id: "one-sample-t",
            title: "单样本 t 检验",
            mode: "formula",
            summary: "检验一个总体均值是否与预先给定的参照值不同。",
            data: "一个独立样本的连续结局和事先确定的 μ₀。",
            useWhen: ["将样本均值与理论值或历史基准比较", "总体方差未知"],
            assumptions: ["观测独立", "小样本下总体近似正态且无严重离群"],
            avoidWhen: ["参照值由同一数据挑选", "结局只是无序类别"],
            mistakes: ["不报告均值差和区间", "把不显著解释为两者完全相同"],
            alternatives: ["强偏态且样本小时用 Wilcoxon 符号秩检验", "已知总体方差且条件满足可用 Z 检验"],
            formula: { expression: "t=(x̄-μ₀)/(s/√n)，df=n-1", symbols: ["μ₀：原假设均值", "s/√n：均值标准误", "df：自由度"] },
            lessonId: "c08-l08",
            keywords: ["单样本t", "均值", "参照值"]
          },
          {
            id: "independent-t",
            title: "独立样本 t 检验",
            mode: "formula",
            summary: "比较两个相互独立群体的总体均值，默认优先使用 Welch 版本。",
            data: "连续结局、一个二分类组变量、组间观测独立。",
            useWhen: ["比较两个独立群体的均值", "需要均值差及其置信区间"],
            assumptions: ["个体独立", "各组近似正态；Welch 检验不要求方差相等"],
            avoidWhen: ["同一对象前后测量", "极端偏态小样本或结局存在强天花板效应"],
            mistakes: ["机械先做方差齐性检验再选版本", "把组间均值差写成个体因果效应"],
            alternatives: ["配对资料用配对 t 检验", "次序或强偏态资料用 Mann–Whitney U"],
            formula: { expression: "t=(x̄₁-x̄₂)/√(s₁²/n₁+s₂²/n₂)", symbols: ["x̄₁-x̄₂：两组样本均值差", "s₁²、s₂²：组内样本方差", "n₁、n₂：两组样本量"] },
            lessonId: "c08-l08",
            keywords: ["独立样本t", "Welch", "均值差"]
          },
          {
            id: "paired-t",
            title: "配对 t 检验",
            mode: "formula",
            summary: "把每一对观测先求差，再检验平均差是否为零。",
            data: "同一对象前后测量，或有明确一一匹配的成对样本。",
            useWhen: ["前后测或匹配对比较", "配对关系能消除对象间稳定差异"],
            assumptions: ["各对之间独立", "差值分布近似正态，而非两次原始值分别正态"],
            avoidWhen: ["两组对象并未一一对应", "忽略失配或大量只有一次测量的对象"],
            mistakes: ["按独立样本分析导致标准误错误", "检查原始值正态而不检查差值"],
            alternatives: ["差值严重偏态用 Wilcoxon 符号秩", "三次以上重复测量用重复测量或混合模型"],
            formula: { expression: "t=d̄/(s_d/√n)，dᵢ=xᵢ,after-xᵢ,before", symbols: ["dᵢ：第 i 对差值", "d̄：平均差", "s_d：差值标准差"] },
            lessonId: "c08-l08",
            keywords: ["配对t", "前后测", "差值"]
          }
        ]
      },
      {
        id: "testing-categories",
        title: "分析类别频数",
        question: "是检验一个分布，还是判断两个类别变量是否有关？",
        methods: [
          {
            id: "chi-square-fit",
            title: "卡方拟合优度检验",
            mode: "formula",
            summary: "比较一个类别变量的观察频数与事先给定的理论频数。",
            data: "互斥类别的频数及原假设下各类别概率。",
            useWhen: ["判断类别比例是否符合理论分布", "每个对象只计入一个类别"],
            assumptions: ["观测独立", "期望频数通常不应过小，参数估计需调整自由度"],
            avoidWhen: ["输入百分比而非频数", "类别定义重叠或重复测量"],
            mistakes: ["把拟合优度检验当成变量独立性检验", "忽略哪些单元格贡献最大"],
            alternatives: ["小期望频数可合并有理论意义的类别或用精确/模拟法", "连续分布拟合使用专门拟合检验和图形"],
            formula: { expression: "χ²=Σ(Oᵢ-Eᵢ)²/Eᵢ", symbols: ["Oᵢ：第 i 类观察频数", "Eᵢ=npᵢ：原假设期望频数", "df：类别数减1再扣除估计参数数"] },
            lessonId: "c08-l10",
            keywords: ["卡方", "拟合优度", "期望频数"]
          },
          {
            id: "chi-square-independence",
            title: "卡方独立性检验",
            mode: "formula",
            summary: "检验同一总体中的两个类别变量是否存在统计关联。",
            data: "两个类别变量形成的列联表频数。",
            useWhen: ["判断教育层次与就业类型等类别变量是否关联", "样本量足以支撑期望频数近似"],
            assumptions: ["个体独立且每人只进入一个单元格", "期望频数 Eᵢⱼ=nᵢ·n·ⱼ/n 足够大"],
            avoidWhen: ["配对二分类资料", "只报告显著性而不报告关联强度"],
            mistakes: ["把关联写成因果", "用百分比替代原始频数计算"],
            alternatives: ["2×2 小样本用 Fisher 精确检验", "控制协变量或预测概率用 Logistic 回归"],
            formula: { expression: "χ²=ΣᵢΣⱼ(Oᵢⱼ-Eᵢⱼ)²/Eᵢⱼ", symbols: ["Oᵢⱼ：单元格观察频数", "Eᵢⱼ：独立原假设下期望频数", "df=(r-1)(c-1)"] },
            lessonId: "c08-l10",
            keywords: ["卡方独立性", "列联表", "类别关联"]
          },
          {
            id: "fisher-exact",
            title: "Fisher 精确检验",
            mode: "formula",
            summary: "在固定边际的 2×2 列联表中计算同样或更极端表格的精确概率。",
            data: "通常为期望频数较小的 2×2 独立列联表。",
            useWhen: ["样本小或稀疏单元格使卡方近似不可靠", "需要精确条件检验"],
            assumptions: ["观测独立", "边际固定的条件检验解释与研究设计相符"],
            avoidWhen: ["配对二分类资料应使用 McNemar 检验", "把精确 p 值等同于效应很大"],
            mistakes: ["因样本大仍称其更客观", "不报告优势比和区间"],
            alternatives: ["期望频数充分时使用卡方独立性检验", "需调整协变量时使用精确或惩罚 Logistic"],
            formula: { expression: "P(table)=((a+b)!(c+d)!(a+c)!(b+d)!)/(a!b!c!d!n!)", symbols: ["a、b、c、d：2×2 表四格频数", "n：总样本量", "双侧 p 值需合计同样或更极端表格概率"] },
            lessonId: "c08-l11",
            keywords: ["Fisher", "精确检验", "小样本"]
          }
        ]
      },
      {
        id: "testing-robust",
        title: "非参数与多重检验",
        question: "参数条件不合适，或同时检验许多假设吗？",
        methods: [
          {
            id: "mann-whitney",
            title: "Mann–Whitney U 检验",
            mode: "formula",
            summary: "比较两个独立组观测的秩位置；只有分布形状相近时才可近似解释为位置差异。",
            data: "两个独立组的有序或连续资料。",
            useWhen: ["结局至少有序且独立 t 检验条件明显不合适", "研究问题可表述为随机抽取两人的相对大小"],
            assumptions: ["组间观测独立", "若解释中位数差，需要两组分布形状近似"],
            avoidWhen: ["配对资料", "误称为任何情况下的中位数检验"],
            mistakes: ["认为非参数等于没有假设", "忽略大量并列秩的修正"],
            alternatives: ["配对资料用 Wilcoxon 符号秩", "关注完整分布差异可使用置换或分布检验"],
            formula: { expression: "U₁=R₁-n₁(n₁+1)/2", symbols: ["R₁：第一组秩和", "n₁：第一组样本量", "U：组间成对比较的秩统计量"] },
            lessonId: "c08-l11",
            keywords: ["Mann-Whitney", "秩和", "非参数"]
          },
          {
            id: "wilcoxon-signed-rank",
            title: "Wilcoxon 符号秩检验",
            mode: "formula",
            summary: "利用配对差值的方向和绝对值秩，检验差值分布是否以零为中心。",
            data: "成对有序或连续观测。",
            useWhen: ["配对 t 检验的差值正态条件不合理", "差值大小仍具有可排序意义"],
            assumptions: ["各对独立", "经典位置解释通常要求差值分布近似对称"],
            avoidWhen: ["两组独立", "大量零差值或量尺无法支持差值排序"],
            mistakes: ["与 Mann–Whitney 混淆", "称其只检验中位数而不说明对称性"],
            alternatives: ["差值近似正态时配对 t 检验", "只使用方向信息可用符号检验"],
            formula: { expression: "W⁺=Σ rank(|dᵢ|)·I(dᵢ>0)", symbols: ["dᵢ：非零配对差值", "rank(|dᵢ|)：绝对差的秩", "I：正差值指示函数"] },
            lessonId: "c08-l11",
            keywords: ["Wilcoxon", "符号秩", "配对"]
          },
          {
            id: "multiple-testing",
            title: "多重检验校正",
            mode: "formula",
            summary: "在同时检验多个假设时控制家族错误率或错误发现率。",
            data: "同一研究族中的 m 个 p 值及预先界定的假设集合。",
            useWhen: ["同时比较多个结局、组或特征", "需要控制至少一次假阳性或错误发现比例"],
            assumptions: ["检验族在看结果前定义", "选择校正方法时说明依赖结构和控制目标"],
            avoidWhen: ["把所有探索性分析随意拆成不同检验族", "只校正显著结果"],
            mistakes: ["把 Bonferroni 当作唯一方法", "校正后不报告原始效应和区间"],
            alternatives: ["少量预设对比可直接建模", "探索性高维筛选常使用 BH-FDR"],
            formula: { expression: "Bonferroni: α*=α/m；BH: p(k)≤kq/m", symbols: ["m：同时检验数", "α：家族错误率目标", "q：错误发现率目标", "p(k)：第 k 个排序 p 值"] },
            lessonId: "c08-l11",
            keywords: ["多重检验", "Bonferroni", "FDR"]
          }
        ]
      }
    ]
  },
  {
    id: "regression",
    shortTitle: "相关回归",
    title: "方差分析、相关与回归",
    description: "区分相关、组均值比较、条件关联和预测。",
    color: "#6b5794",
    rootQuestion: "你要比较多个均值、度量关联，还是建立连续结局模型？",
    branches: [
      {
        id: "regression-association",
        title: "两个变量的关联",
        question: "关系近似线性且连续，还是只要求单调次序？",
        methods: [
          {
            id: "pearson-correlation",
            title: "Pearson 相关",
            mode: "formula",
            summary: "度量两个数值变量之间线性关系的方向与强度。",
            data: "成对连续观测。",
            useWhen: ["散点图显示近似线性关系", "需要无量纲线性关联指标"],
            assumptions: ["成对观测独立", "关系近似线性且没有支配性离群点"],
            avoidWhen: ["明显非线性但单调", "由共同趋势造成的伪相关"],
            mistakes: ["相关不显著就称没有任何关系", "把相关解释为因果"],
            alternatives: ["单调非线性或有序资料用 Spearman", "控制协变量和预测用回归"],
            formula: { expression: "r=Σ(xᵢ-x̄)(yᵢ-ȳ)/√[Σ(xᵢ-x̄)²Σ(yᵢ-ȳ)²]", symbols: ["r：样本线性相关系数", "x̄、ȳ：样本均值", "r 范围为 -1 到 1"] },
            lessonId: "c04-l03",
            keywords: ["Pearson", "相关", "线性"]
          },
          {
            id: "spearman-correlation",
            title: "Spearman 秩相关",
            mode: "formula",
            summary: "对两个变量的秩计算相关，度量单调关系。",
            data: "至少为有序的成对观测。",
            useWhen: ["关系单调但不线性", "有序资料或离群值使 Pearson 不稳健"],
            assumptions: ["观测对独立", "关系若存在应大体单调"],
            avoidWhen: ["周期或 U 形关系", "大量并列秩却使用无并列简式"],
            mistakes: ["称为完全无假设", "把秩相关当斜率解释"],
            alternatives: ["线性连续资料用 Pearson", "复杂非线性关系用图形或广义加性模型"],
            formula: { expression: "ρₛ=cor(rank X, rank Y)；无并列时 1-6Σdᵢ²/[n(n²-1)]", symbols: ["dᵢ：两变量秩之差", "n：成对观测数", "有并列秩时直接计算秩的 Pearson 相关"] },
            lessonId: "c04-l03",
            keywords: ["Spearman", "秩相关", "单调"]
          }
        ]
      },
      {
        id: "regression-groups",
        title: "三个及以上均值",
        question: "组间独立、重复测量，还是还需控制连续协变量？",
        methods: [
          {
            id: "one-way-anova",
            title: "单因素方差分析",
            mode: "formula",
            summary: "用组间变异与组内变异之比，整体检验三个及以上独立组均值是否相同。",
            data: "连续结局、一个含多个水平的组变量。",
            useWhen: ["先进行整体组均值检验", "避免对多组反复做 t 检验"],
            assumptions: ["个体独立", "组内残差近似正态；经典 ANOVA 还要求方差齐性"],
            avoidWhen: ["同一对象被重复测量", "整体显著后不做校正就逐对比较"],
            mistakes: ["显著就声称每组都不同", "不报告效应量和事后比较规则"],
            alternatives: ["方差不齐用 Welch ANOVA", "重复测量用重复测量 ANOVA 或混合模型"],
            formula: { expression: "F=MS_between/MS_within", symbols: ["MS_between：组间均方", "MS_within：组内均方", "F 大表示组间差异相对组内噪声更大"] },
            lessonId: "c09-l01",
            keywords: ["ANOVA", "F检验", "多组均值"]
          },
          {
            id: "repeated-anova",
            title: "重复测量方差分析",
            mode: "formula",
            summary: "在同一对象多次测量时分离个体间差异，检验时间或条件均值。",
            data: "同一对象在多个时间点或条件下的连续结局。",
            useWhen: ["完整、平衡的重复测量设计", "关注平均时间或条件效应"],
            assumptions: ["对象之间独立", "差值协方差满足球形性；否则需校正"],
            avoidWhen: ["大量不等时间点或缺失", "忽略个体内相关直接做普通 ANOVA"],
            mistakes: ["不检查球形性", "把时间效应直接当作处理因果效应"],
            alternatives: ["不平衡或缺失较多使用线性混合模型", "只有两个时间点可用配对 t"],
            formula: { expression: "F=MS_effect/MS_error(within)", symbols: ["MS_effect：时间或条件效应均方", "MS_error(within)：个体内误差均方", "违反球形性时校正自由度"] },
            lessonId: "c09-l02",
            keywords: ["重复测量", "球形性", "组内相关"]
          },
          {
            id: "ancova",
            title: "协方差分析 ANCOVA",
            mode: "formula",
            summary: "在线性模型中比较组均值，同时调整预先指定的连续协变量。",
            data: "连续结局、类别组变量及一个或多个协变量。",
            useWhen: ["实验中用基线值提高精度", "比较调整后的条件均值"],
            assumptions: ["组内回归斜率可比较，或明确建模交互", "协变量测量可靠且不受处理影响"],
            avoidWhen: ["调整处理后的中介变量", "协变量与组别关系完全不重叠"],
            mistakes: ["把统计调整称为随机化", "未检验组×协变量交互"],
            alternatives: ["斜率不同则加入交互项", "观察研究因果调整需使用明确识别策略"],
            formula: { expression: "Yᵢ=β₀+β₁Groupᵢ+β₂Xᵢ+εᵢ", symbols: ["β₁：给定 X 后的组差异", "X：协变量", "ε：残差"] },
            lessonId: "c09-l03",
            keywords: ["ANCOVA", "协变量", "调整均值"]
          }
        ]
      },
      {
        id: "regression-continuous",
        title: "连续结局模型",
        question: "只有一个解释变量，还是需要同时调整多个变量与交互？",
        methods: [
          {
            id: "linear-regression",
            title: "一元线性回归",
            mode: "formula",
            summary: "用直线描述一个解释变量变化时连续结局的条件均值变化。",
            data: "连续结局 Y 与一个解释变量 X。",
            useWhen: ["散点图关系近似线性", "需要估计斜率及其不确定性"],
            assumptions: ["条件均值形式近似线性", "误差独立、同方差；区间推断还需分布条件"],
            avoidWhen: ["关系明显弯曲", "时间或聚类依赖被忽略"],
            mistakes: ["用高 R² 证明因果", "外推到观测范围之外"],
            alternatives: ["非线性用变换、样条或 GAM", "二元结局用 Logistic 回归"],
            formula: { expression: "Yᵢ=β₀+β₁Xᵢ+εᵢ", symbols: ["β₀：X=0 时的条件均值", "β₁：X 每增加1单位时 Y 条件均值的变化", "εᵢ：未解释部分"] },
            lessonId: "c09-l05",
            keywords: ["线性回归", "斜率", "连续结局"]
          },
          {
            id: "multiple-regression",
            title: "多元线性回归",
            mode: "formula",
            summary: "同时纳入多个解释变量，估计给定其他变量后的条件关联。",
            data: "连续结局及多个数值或编码后的类别解释变量。",
            useWhen: ["需要调整预先指定的协变量", "评估多个预测变量的增量信息"],
            assumptions: ["模型形式正确且残差结构合理", "不存在严重共线性或高影响点"],
            avoidWhen: ["依据显著性自动逐步挑变量后作确认性推断", "把控制变量数量等同于因果识别"],
            mistakes: ["忽略虚拟变量参照组", "比较不同量纲系数的绝对大小"],
            alternatives: ["高维预测用正则化", "嵌套或纵向资料用混合模型"],
            formula: { expression: "Yᵢ=β₀+ΣⱼβⱼXᵢⱼ+εᵢ", symbols: ["βⱼ：给定其他 X 后的偏回归系数", "Xᵢⱼ：第 i 个体第 j 个预测量", "εᵢ：残差"] },
            lessonId: "c09-l06",
            keywords: ["多元回归", "调整", "共线性"]
          },
          {
            id: "interaction-regression",
            title: "交互效应模型",
            mode: "formula",
            summary: "检验一个变量的关联是否随另一个变量的水平而改变。",
            data: "连续结局及至少两个理论上可能相互作用的解释变量。",
            useWhen: ["研究调节效应或异质性", "理论预期斜率在不同组间不同"],
            assumptions: ["主效应与交互项共同保留", "连续变量中心化只改变解释基准，不改变拟合"],
            avoidWhen: ["从大量交互中只挑显著者", "把不显著交互解释为各组完全一致"],
            mistakes: ["有交互时孤立解释主效应", "只报系数不画条件效应"],
            alternatives: ["非线性调节可用样条交互", "因果异质性需要额外识别假设"],
            formula: { expression: "Y=β₀+β₁X+β₂Z+β₃XZ+ε", symbols: ["β₃：Z 每变化1单位时 X 斜率的变化", "β₁：Z=0 时 X 的斜率", "XZ：乘积交互项"] },
            lessonId: "c09-l04",
            keywords: ["交互效应", "调节", "条件斜率"]
          }
        ]
      }
    ]
  },
  {
    id: "complex-outcomes",
    shortTitle: "复杂结局",
    title: "分类、计数、纵向与生存数据",
    description: "让模型的链接函数和相关结构与真实资料结构一致。",
    color: "#27628a",
    rootQuestion: "结局是类别、计数、重复测量，还是事件时间？",
    branches: [
      {
        id: "complex-categorical",
        title: "类别与计数结局",
        question: "结局有两个类别、多个类别，还是非负计数？",
        methods: [
          {
            id: "binary-logistic",
            title: "二元 Logistic 回归",
            mode: "formula",
            summary: "对二元结局的对数优势建模，并可给出预测概率和优势比。",
            data: "0/1 结局及一个或多个解释变量。",
            useWhen: ["预测事件是否发生", "调整协变量后估计条件优势比"],
            assumptions: ["观测独立或已正确建模聚类", "连续预测量与 logit 近似线性"],
            avoidWhen: ["常见结局下把优势比直接说成风险比", "完全分离且仍用普通极大似然"],
            mistakes: ["只报优势比不报基准概率", "用分类准确率替代校准检查"],
            alternatives: ["直接估计风险比可用合适的 GLM", "重复二元资料用 GEE 或混合 Logistic"],
            formula: { expression: "log[p/(1-p)]=β₀+ΣβⱼXⱼ；OR=e^β", symbols: ["p：事件条件概率", "p/(1-p)：优势", "e^β：预测量增加1单位的条件优势比"] },
            lessonId: "c11-l01",
            keywords: ["Logistic", "二元结局", "优势比"]
          },
          {
            id: "ordinal-multinomial",
            title: "有序与多项 Logistic",
            mode: "formula",
            summary: "有序模型利用类别次序，多项模型处理没有自然次序的多个类别。",
            data: "三个及以上类别的单一结局。",
            useWhen: ["等级结局且比例优势假设合理时用有序 Logistic", "无序多分类结局使用多项 Logistic"],
            assumptions: ["类别编码与研究问题一致", "有序模型需检查比例优势或平行线假设"],
            avoidWhen: ["强行给无序类别排序", "有序模型明显违反比例优势仍只报一个 OR"],
            mistakes: ["忽略参照类别", "只解释系数而不报告预测概率"],
            alternatives: ["比例优势不成立可用部分比例优势模型", "类别存在嵌套过程可用序贯模型"],
            formula: { expression: "有序：logit[P(Y≤k)]=αₖ-βX；多项：log[P(Y=k)/P(Y=r)]=αₖ+βₖX", symbols: ["k：类别阈值或目标类别", "r：参照类别", "β：条件 log-odds 变化"] },
            lessonId: "c11-l04",
            keywords: ["有序Logistic", "多项Logistic", "多分类"]
          },
          {
            id: "count-regression",
            title: "Poisson 与负二项回归",
            mode: "formula",
            summary: "对计数均值的对数建模；负二项允许方差超过均值。",
            data: "非负整数计数，并可能具有不同暴露时间。",
            useWhen: ["解释事件率或事件次数", "过度离散时由 Poisson 转向负二项"],
            assumptions: ["Poisson 条件均值等于条件方差", "暴露量通过 offset 正确进入模型"],
            avoidWhen: ["大量结构性零未建模", "把计数当连续结果做普通回归"],
            mistakes: ["遗漏 offset", "未检查过度离散就报告 Poisson 标准误"],
            alternatives: ["额外零值用零膨胀或 hurdle 模型", "重复计数用混合模型或 GEE"],
            formula: { expression: "log E(Y|X)=β₀+βX+log(exposure)；IRR=e^β", symbols: ["E(Y|X)：条件期望计数", "offset：已知暴露量对数", "IRR：发生率比"] },
            lessonId: "c11-l05",
            keywords: ["Poisson回归", "负二项", "发生率比"]
          }
        ]
      },
      {
        id: "complex-longitudinal",
        title: "重复与层次结构",
        question: "数据是个体内重复，还是个体嵌套于群体？",
        methods: [
          {
            id: "fixed-effects-panel",
            title: "面板固定效应",
            mode: "formula",
            summary: "利用同一个体随时间的变化，消除不随时间变化的个体特征。",
            data: "同一单位多个时间点的面板资料。",
            useWhen: ["担心时间不变的未观测个体差异", "解释单位内部 X 变化与 Y 变化的关联"],
            assumptions: ["严格外生性或相应识别假设", "关键变量在个体内有足够变化"],
            avoidWhen: ["主要变量时间不变", "存在由过去结局影响当前处理的动态反馈却未建模"],
            mistakes: ["称其控制全部混杂", "把组内效应解释为组间差异"],
            alternatives: ["关注组间差异可用随机效应并检验假设", "时间变化混杂可用边际结构模型"],
            formula: { expression: "Yᵢₜ=αᵢ+βXᵢₜ+γₜ+εᵢₜ", symbols: ["αᵢ：单位固定效应", "γₜ：共同时间效应", "β：单位内部 X 变化的条件关联"] },
            lessonId: "c14-l02",
            keywords: ["面板", "固定效应", "组内变化"]
          },
          {
            id: "multilevel-model",
            title: "多层模型",
            mode: "formula",
            summary: "显式建模学生—学校、测量—个体等层次中的随机差异与相关。",
            data: "单位嵌套于群组，或同一单位重复测量。",
            useWhen: ["估计组内相关与群组差异", "需要随机截距、随机斜率或跨层交互"],
            assumptions: ["层次结构和随机效应分布设定合理", "群组数量足以支持目标随机效应"],
            avoidWhen: ["极少群组却拟合复杂随机结构", "忽略抽样权重或交叉分类"],
            mistakes: ["把个体层和群体层效应混为一谈", "只按收敛与否删随机斜率"],
            alternatives: ["只需边际平均效应可用 GEE", "交叉归属使用交叉分类或多成员模型"],
            formula: { expression: "Yᵢⱼ=β₀+β₁Xᵢⱼ+u₀ⱼ+u₁ⱼXᵢⱼ+εᵢⱼ", symbols: ["j：群组", "u₀ⱼ：随机截距", "u₁ⱼ：随机斜率", "εᵢⱼ：个体层误差"] },
            lessonId: "c14-l03",
            keywords: ["多层模型", "随机效应", "ICC"]
          }
        ]
      },
      {
        id: "complex-survival",
        title: "事件时间",
        question: "你只比较生存曲线，还是需要调整协变量？",
        methods: [
          {
            id: "kaplan-meier",
            title: "Kaplan–Meier 估计",
            mode: "formula",
            summary: "在右删失资料中，用每个事件时点的条件生存概率乘积估计生存曲线。",
            data: "随访时间、事件指示和可选分组变量。",
            useWhen: ["描述到事件时间的分布", "比较组间未经调整的生存曲线"],
            assumptions: ["删失在相关条件下非信息性", "事件时间与删失时间记录准确"],
            avoidWhen: ["把删失者当作无事件到永久", "竞争风险明显却把其他事件简单删失"],
            mistakes: ["尾部风险集很小时仍过度解释曲线", "只给 log-rank p 值不报风险集"],
            alternatives: ["调整协变量使用 Cox 模型", "竞争风险关注累积发生函数"],
            formula: { expression: "Ŝ(t)=∏_{tᵢ≤t}(1-dᵢ/nᵢ)", symbols: ["dᵢ：时点 tᵢ 的事件数", "nᵢ：该时点前风险集人数", "Ŝ(t)：超过 t 仍未发生事件的估计概率"] },
            lessonId: "c14-l06",
            keywords: ["Kaplan-Meier", "生存曲线", "删失"]
          },
          {
            id: "cox-model",
            title: "Cox 比例风险模型",
            mode: "formula",
            summary: "在不指定基准风险形状的情况下，估计协变量与瞬时风险的相对关系。",
            data: "事件或删失时间、事件指示及协变量。",
            useWhen: ["调整协变量后比较相对风险", "比例风险假设大体合理"],
            assumptions: ["风险比随时间近似恒定，或已建模时间交互", "删失机制可接受"],
            avoidWhen: ["风险曲线明显交叉却只报单一 HR", "把风险比直接解释为概率比"],
            mistakes: ["不检查比例风险", "忽略非线性连续协变量"],
            alternatives: ["比例风险不成立可分层、加时间交互或使用 AFT", "竞争风险使用原因别风险或 Fine–Gray"],
            formula: { expression: "h(t|X)=h₀(t)exp(βX)；HR=e^β", symbols: ["h₀(t)：未参数化基准风险", "h(t|X)：给定 X 的瞬时风险", "HR：条件风险比"] },
            lessonId: "c14-l06",
            keywords: ["Cox", "风险比", "比例风险"]
          }
        ]
      }
    ]
  },
  {
    id: "causal-computational",
    shortTitle: "因果计算",
    title: "因果推断、贝叶斯与机器学习",
    description: "先区分识别问题与预测问题，再选择估计与验证策略。",
    color: "#a04d62",
    rootQuestion: "你要估计干预效果、更新不确定性，还是预测新样本？",
    branches: [
      {
        id: "causal-design",
        title: "因果效应",
        question: "处理如何分配？是否有时间、阈值或工具变量提供识别？",
        methods: [
          {
            id: "randomized-experiment",
            title: "随机实验",
            mode: "formula",
            summary: "通过随机分配使潜在结果在期望上可交换，直接比较处理组和对照组。",
            data: "随机分配记录、处理执行情况与预先定义的结局。",
            useWhen: ["研究者能够伦理且实际地随机分配处理", "需要明确的平均处理效应"],
            assumptions: ["随机化实施未被破坏", "SUTVA、一致性及结局测量规则成立"],
            avoidWhen: ["严重失访或不依从却只做完成者分析", "把随机抽样与随机分配混淆"],
            mistakes: ["随机后仍按显著性挑协变量", "事后更换主要结局"],
            alternatives: ["不能随机时使用可辩护的准实验或观察研究识别策略", "不依从时区分 ITT 与符合方案效应"],
            formula: { expression: "ATÊ = Ȳ(T=1)-Ȳ(T=0)", symbols: ["T：随机处理指示", "Ȳ(T=1)：处理组平均结局", "Ȳ(T=0)：对照组平均结局"] },
            lessonId: "c13-l01",
            keywords: ["随机实验", "ATE", "ITT"]
          },
          {
            id: "propensity-weighting",
            title: "倾向得分与逆概率加权",
            mode: "formula",
            summary: "按接受实际处理的逆概率加权，构造在已测协变量上更可比的伪总体。",
            data: "观察性处理、处理前协变量和结局。",
            useWhen: ["可交换性在丰富的处理前协变量条件下可信", "希望估计 ATE 或 ATT 并检查平衡"],
            assumptions: ["无未测混杂", "正值性、一致性与倾向模型足够正确"],
            avoidWhen: ["极端权重反映缺乏重叠", "把中介或碰撞变量放入倾向模型"],
            mistakes: ["只看倾向模型预测率，不看加权后平衡", "加权后仍用普通标准误"],
            alternatives: ["重叠差时限制目标总体或使用匹配", "结合结局模型使用双重稳健估计"],
            formula: { expression: "wᵢ=Tᵢ/e(Xᵢ)+(1-Tᵢ)/[1-e(Xᵢ)]", symbols: ["e(X)：给定处理前协变量的处理概率", "T：处理指示", "w：ATE 逆概率权重"] },
            lessonId: "c13-l05",
            keywords: ["倾向得分", "IPW", "平衡"]
          },
          {
            id: "difference-in-differences",
            title: "双重差分 DID",
            mode: "formula",
            summary: "比较处理组与对照组从政策前到政策后的变化差。",
            data: "至少两个组和前后两个时期，最好有多个处理前时期。",
            useWhen: ["政策只影响部分单位且存在可比对照趋势", "能够检查处理前趋势"],
            assumptions: ["无处理时两组将保持平行趋势", "无提前反应、溢出和同期差异冲击"],
            avoidWhen: ["处理时点错开却直接使用有偏的双向固定效应", "仅凭处理前不显著证明平行趋势"],
            mistakes: ["把组间水平差异当政策效果", "不画事件研究图"],
            alternatives: ["阈值决定处理时考虑 RDD", "错开处理采用适合异质效应的 DID 估计"],
            formula: { expression: "DID=(ȲT,post-ȲT,pre)-(ȲC,post-ȲC,pre)", symbols: ["T、C：处理组与对照组", "pre、post：处理前与处理后", "DID：两组变化量之差"] },
            lessonId: "c13-l06",
            keywords: ["DID", "平行趋势", "政策评估"]
          },
          {
            id: "rdd-iv",
            title: "断点回归与工具变量",
            mode: "formula",
            summary: "RDD 利用阈值附近的分配跳跃；IV 利用只通过处理影响结局的外生变化。",
            data: "RDD 需要运行变量和阈值；IV 需要工具、处理与结局。",
            useWhen: ["处理由明确阈值规则决定", "存在相关且满足排除限制的工具变量"],
            assumptions: ["RDD 阈值附近潜在结果连续且无精确操纵", "IV 满足相关性、独立性、排除限制；LATE 还需单调性"],
            avoidWhen: ["阈值同时触发其他干预", "工具变量直接影响结局"],
            mistakes: ["把局部效应推广到全部人群", "只凭第一阶段显著声称工具有效"],
            alternatives: ["有可比时间趋势使用 DID", "已测混杂充分时使用加权或标准化"],
            formula: { expression: "RDD: τ=limₓ↓cE(Y|X=x)-limₓ↑cE(Y|X=x)；IV: βIV=Cov(Z,Y)/Cov(Z,D)", symbols: ["c：处理阈值", "Z：工具变量", "D：处理", "τ、βIV：相应识别条件下的局部效应"] },
            lessonId: "c13-l08",
            keywords: ["RDD", "工具变量", "局部效应"]
          }
        ]
      },
      {
        id: "causal-bayesian",
        title: "贝叶斯推断",
        question: "需要把先验知识与当前数据联合，并直接表达参数不确定性吗？",
        methods: [
          {
            id: "bayesian-inference",
            title: "贝叶斯后验推断",
            mode: "formula",
            summary: "通过贝叶斯定理把先验和似然合成为参数的后验分布。",
            data: "明确的概率模型、观测数据与可辩护的先验。",
            useWhen: ["需要概率形式的参数区间或预测", "有历史知识、层次结构或小样本正则化需求"],
            assumptions: ["似然模型与先验都应透明", "计算算法已通过收敛和后验预测检查"],
            avoidWhen: ["用先验掩盖数据与模型冲突", "只报告后验均值而不做敏感性分析"],
            mistakes: ["把非信息先验当作完全无影响", "MCMC 运行结束即认为收敛"],
            alternatives: ["频率学派区间满足研究目标时可使用经典估计", "复杂似然可使用近似贝叶斯但需说明误差"],
            formula: { expression: "p(θ|y)=p(y|θ)p(θ)/p(y) ∝ likelihood × prior", symbols: ["θ：未知参数", "p(θ)：先验", "p(y|θ)：似然", "p(θ|y)：后验"] },
            lessonId: "c15-l02",
            keywords: ["贝叶斯", "后验", "先验"]
          }
        ]
      },
      {
        id: "causal-prediction",
        title: "预测与高维资料",
        question: "目标是新样本预测，还是稀疏变量选择？",
        methods: [
          {
            id: "regularization",
            title: "Ridge、Lasso 与 Elastic Net",
            mode: "formula",
            summary: "在经验损失中加入系数惩罚，降低高维或共线数据中的预测方差。",
            data: "较多预测变量的监督学习数据。",
            useWhen: ["预测变量多或高度相关", "需要通过交叉验证选择惩罚强度"],
            assumptions: ["训练与目标部署分布足够接近", "所有预处理步骤只在训练折内拟合"],
            avoidWhen: ["把 Lasso 选择后的普通 p 值当作有效确认性推断", "在测试集上调 λ"],
            mistakes: ["标准化使用全数据造成泄漏", "把系数压缩解释为因果控制"],
            alternatives: ["复杂非线性预测使用树模型", "低维解释性问题使用预设回归"],
            formula: { expression: "minβ [Loss(β)+λ{αΣ|βⱼ|+(1-α)Σβⱼ²/2}]", symbols: ["λ：惩罚强度", "α=1 为 Lasso，α=0 为 Ridge", "Loss：训练损失"] },
            lessonId: "c17-l02",
            keywords: ["Ridge", "Lasso", "正则化"]
          },
          {
            id: "cross-validated-ml",
            title: "交叉验证的机器学习",
            mode: "formula",
            summary: "在训练折拟合，在未参与拟合的验证折评估泛化损失。",
            data: "可划分训练、验证和最终测试集的特征与标签。",
            useWhen: ["主要目标是新样本预测", "需要比较树、森林、提升或其他候选模型"],
            assumptions: ["划分方式模拟真实部署场景", "时间、群组和预处理结构在切分中得到尊重"],
            avoidWhen: ["把预测准确视为因果证据", "反复查看测试集后仍称其未见数据"],
            mistakes: ["随机切分时间序列", "类别不平衡只看准确率"],
            alternatives: ["解释参数关系使用预设统计模型", "分布漂移明显时做外部验证与再校准"],
            formula: { expression: "CV Risk=(1/K)Σₖ (1/|Vₖ|)Σᵢ∈Vₖ L(yᵢ,f⁽⁻ᵏ⁾(xᵢ))", symbols: ["Vₖ：第 k 个验证折", "f⁽⁻ᵏ⁾：未使用该折训练的模型", "L：与任务一致的损失函数"] },
            lessonId: "c17-l01",
            keywords: ["交叉验证", "机器学习", "泛化"]
          }
        ]
      }
    ]
  },
  {
    id: "qualitative",
    shortTitle: "质性博士",
    title: "质性、混合研究与博士研究设计",
    description: "不是所有研究问题都应被压成变量和公式；先匹配认识论与证据形式。",
    color: "#58704a",
    rootQuestion: "你要理解意义、生成理论、比较组态，还是综合多种证据？",
    branches: [
      {
        id: "qualitative-meaning",
        title: "意义与理论生成",
        question: "目标是概括经验主题、生成过程理论，还是理解文化实践？",
        methods: [
          {
            id: "thematic-analysis",
            title: "主题分析",
            mode: "process",
            summary: "系统识别资料中与研究问题相关的意义模式，并形成有证据支撑的主题。",
            data: "访谈、焦点小组、开放文本、观察记录或文件。",
            useWhen: ["需要跨资料识别意义模式", "研究不以生成形式理论为必要目标"],
            assumptions: ["说明归纳/演绎、语义/潜在和现实主义/建构主义取向", "研究者反身性与编码决策可追踪"],
            avoidWhen: ["只做词频后直接命名主题", "把主题当作客观存在且无需解释的类别"],
            mistakes: ["主题只是访谈提纲标题", "没有反例、引文和主题边界"],
            alternatives: ["目标是生成过程理论使用扎根理论", "关注语言如何建构现实使用话语分析"],
            process: [noFormula, "熟悉资料并记录初步观察", "生成与研究问题相关的编码", "聚合候选主题并检查内部一致性与外部区分", "用反例修订主题", "以资料引文和分析论证共同报告"],
            lessonId: "c18-l08",
            keywords: ["主题分析", "编码", "反身性"]
          },
          {
            id: "grounded-theory",
            title: "扎根理论",
            mode: "process",
            summary: "通过持续比较、理论抽样和备忘录，从资料中发展解释社会过程的理论。",
            data: "能够随分析迭代收集的访谈、观察、文件及其他理论相关资料。",
            useWhen: ["研究目标是解释行动或过程如何发生", "资料收集可由正在形成的理论引导"],
            assumptions: ["明确经典、程序化或建构主义传统", "理论抽样不是人口代表性抽样"],
            avoidWhen: ["研究只需描述预设主题", "一次性便利样本却宣称达到理论饱和"],
            mistakes: ["把开放—主轴—选择性编码当机械流水线", "编码很多就等同于生成理论"],
            alternatives: ["只需模式总结使用主题分析", "研究个人故事结构使用叙事分析"],
            process: [noFormula, "初始或开放编码贴近行动", "持续比较事件、编码与个案", "写备忘录发展范畴属性和关系", "按理论缺口继续抽样", "检验负面案例并整合核心范畴", "说明饱和判断及理论边界"],
            lessonId: "c18-l04",
            keywords: ["扎根理论", "理论抽样", "持续比较"]
          },
          {
            id: "ethnography",
            title: "民族志与数字民族志",
            mode: "process",
            summary: "通过长期、情境化参与理解群体实践、意义世界与权力关系。",
            data: "参与观察、田野笔记、访谈、物质文化和数字平台痕迹。",
            useWhen: ["研究问题依赖场域中的实践与语境", "需要连接言说、行动和制度环境"],
            assumptions: ["研究者位置和进入场域过程被反思", "线上公开可见不自动等于伦理上可自由使用"],
            avoidWhen: ["短暂浏览资料却声称深描", "将一个场域直接代表整个文化"],
            mistakes: ["田野笔记只有事件流水账", "隐去平台和关系结构造成去语境化"],
            alternatives: ["边界明确的问题可用个案研究", "只分析文本意义模式可用主题或话语分析"],
            process: [noFormula, "界定场域、关系和研究者位置", "协商进入与持续同意", "观察、参与、访谈并写描述与反思笔记", "在场域内外比较实践", "用厚描连接微观事件与制度语境", "执行匿名化和退出安排"],
            lessonId: "c19-l01",
            keywords: ["民族志", "深描", "数字田野"]
          }
        ]
      },
      {
        id: "qualitative-comparison",
        title: "比较与组态",
        question: "你是在追踪单一个案机制，还是比较条件组合？",
        methods: [
          {
            id: "process-tracing",
            title: "个案研究与过程追踪",
            mode: "process",
            summary: "在个案内部检验因果机制的连续证据，而不是只比较变量共变。",
            data: "时间有序的档案、访谈、文件、观察和关键事件证据。",
            useWhen: ["理论关心机制如何运作", "存在可区分竞争解释的诊断性证据"],
            assumptions: ["个案选择逻辑透明", "对证据来源、时间顺序和替代解释进行评估"],
            avoidWhen: ["仅凭结果发生后讲一个顺畅故事", "把单一个案频率推广为总体概率"],
            mistakes: ["只寻找支持理论的证据", "不区分必要、充分与弱诊断证据"],
            alternatives: ["比较多个条件组态使用 QCA", "估计总体平均效应使用适当量化设计"],
            process: [noFormula, "明确机制及竞争解释", "写出机制各环节应留下的可观察痕迹", "按时间线收集来源独立的证据", "评估每条证据对不同理论的诊断力", "寻找反证并界定结论范围"],
            lessonId: "c19-l04",
            keywords: ["过程追踪", "机制", "个案研究"]
          },
          {
            id: "qca",
            title: "QCA 与模糊集 QCA",
            mode: "formula",
            summary: "比较案例中的条件组态，分析必要条件与通向结果的充分路径。",
            data: "中小样本案例及经理论校准的集合隶属度。",
            useWhen: ["理论预期并发因果、多条路径和因果不对称", "案例数量适合系统组态比较"],
            assumptions: ["条件选择与校准锚点有理论依据", "真值表阈值和矛盾组态处理透明"],
            avoidWhen: ["把原始 Likert 分数直接当集合隶属度", "用 QCA 替代缺乏案例知识的问题"],
            mistakes: ["把集合一致性当统计显著性", "只报告最简解不报告稳健性"],
            alternatives: ["关注平均边际关系使用回归", "关注个案机制使用过程追踪"],
            formula: { expression: "Necessity Consistency=Σmin(Xᵢ,Yᵢ)/ΣYᵢ；Sufficiency Consistency=Σmin(Xᵢ,Yᵢ)/ΣXᵢ", symbols: ["Xᵢ：案例对条件或组态的集合隶属度", "Yᵢ：结果集合隶属度", "必要性检验 Y⊆X，充分性检验 X⊆Y"] },
            lessonId: "c19-l05",
            keywords: ["QCA", "模糊集", "组态"]
          }
        ]
      },
      {
        id: "qualitative-integration",
        title: "整合证据与论文设计",
        question: "不同资料怎样连接，或怎样形成可审查的完整研究方案？",
        methods: [
          {
            id: "mixed-methods",
            title: "混合研究设计",
            mode: "process",
            summary: "在同一研究问题下有意连接、嵌入或合并质性与量化证据。",
            data: "至少两类资料，并有明确的整合节点与共同推论目标。",
            useWhen: ["单一资料无法回答问题的不同维度", "量化结果需要解释或质性发现需要后续检验"],
            assumptions: ["说明聚合式、解释式或探索式时序", "样本和推论不能未经论证直接互相替代"],
            avoidWhen: ["仅在一篇论文并列两种资料却从未整合", "为显得全面而增加无关方法"],
            mistakes: ["只在讨论部分口头三角互证", "不处理两类证据冲突"],
            alternatives: ["问题单一且一种资料足够时使用单方法设计", "证据综合而非收集新资料时做系统综述"],
            process: [noFormula, "定义每类资料各自回答的问题", "选择时序和优先级", "明确连接、嵌入或合并的整合节点", "制作联合展示表", "解释收敛、互补与冲突证据", "形成超越两份独立结果的元推论"],
            lessonId: "c19-l07",
            keywords: ["混合研究", "联合展示", "证据整合"]
          },
          {
            id: "meta-analysis",
            title: "随机效应元分析",
            mode: "formula",
            summary: "综合多项研究的效应量，同时允许真实效应在研究间变化。",
            data: "可比较的研究效应量及其采样方差。",
            useWhen: ["研究问题、效应定义和设计具有可辩护的可合并性", "需要总体平均效应及异质性"],
            assumptions: ["纳入研究来自相关研究分布", "选择偏倚、依赖效应量和研究质量得到评估"],
            avoidWhen: ["研究问题和效应定义根本不可比", "只因存在数字就强行汇总"],
            mistakes: ["把 I² 当作绝对异质性大小", "漏掉预测区间和偏倚风险"],
            alternatives: ["不可合并时做结构化叙述综合", "质性研究使用相应的定性证据综合"],
            formula: { expression: "μ̂=Σwᵢyᵢ/Σwᵢ，wᵢ=1/(vᵢ+τ²)", symbols: ["yᵢ：第 i 项研究效应量", "vᵢ：采样方差", "τ²：研究间异质性方差", "μ̂：平均真实效应估计"] },
            lessonId: "c23-l04",
            keywords: ["元分析", "随机效应", "异质性"]
          },
          {
            id: "research-design-canvas",
            title: "研究设计画布",
            mode: "process",
            summary: "让理论问题、证据来源、抽样、测量、分析、伦理和结论边界彼此对齐。",
            data: "研究问题、理论框架、目标对象、可获得资料和现实约束。",
            useWhen: ["开题、预注册或重大设计修改前", "发现方法很多但不知道为何选择时"],
            assumptions: ["先界定描述、解释、预测或因果目标", "方法选择服从研究问题与资料生成过程"],
            avoidWhen: ["先决定软件模型再倒写研究问题", "把画布当作一次性行政表格"],
            mistakes: ["研究问题、测量和结论不在同一分析层级", "没有预先写出失败条件和伦理风险"],
            alternatives: ["因果问题进一步绘制 DAG", "证据综合问题使用系统综述协议"],
            process: [noFormula, "写出理论缺口和可回答的研究问题", "界定分析单位、目标总体和资料生成机制", "连接概念、操作化与抽样", "选择能回答问题的分析策略", "列出识别假设、失败条件和稳健性检查", "规划伦理、数据管理、报告与归档"],
            lessonId: "c24-l02",
            keywords: ["研究设计", "方法选择", "预注册"]
          }
        ]
      }
    ]
  }
];

export const methodNodes = methodCategories.flatMap(category =>
  category.branches.flatMap(branch => branch.methods)
);

export const methodNodeMap = new Map(methodNodes.map(node => [node.id, node]));
