export type Difficulty = "入门" | "进阶" | "高阶";
export type ExerciseLevel = "简单" | "中等" | "困难";
export type LessonSection = { id:string; title:string; pro:string[]; kid:string[] };
export type Exercise = { id:string; level:ExerciseLevel; type:"概念"|"判断"|"计算"|"方法选择"|"结果解释"|"纠错"|"代码"|"研究设计"; prompt:string; solution:{ idea:string; steps:string[]; result:string; pitfalls:string; kid:string; code?:string } };
export type CodeLab = { purpose:string; data:string; code:string; expectedOutput:string; interpretation:string; diagnostics:string };
export type Lesson = { id:string; chapterId:number; order:number; unitId?:string; title:string; focus:string[]; difficulty:Difficulty; minutes:number; objectives:string[]; prerequisites:string[]; keywords:string[]; sections:LessonSection[]; formula:string; symbolNotes:string[]; comparison:{method:string;bestFor:string;strength:string;limit:string}[]; workedExample:{question:string;steps:string[];answer:string}; caseStudy:string; codeLab?:CodeLab; reportTemplate:string; glossary:{term:string;meaning:string}[]; references:string[]; exercises:Exercise[]; openTask?:{prompt:string;rubric:string[];example:string;defects:string[]} };
