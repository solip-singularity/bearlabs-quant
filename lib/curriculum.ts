import { chapters as sourceChapters, type Chapter as SourceChapter } from "./course-data.ts";
import { lessons as authoredLessons } from "./content/index.ts";
export type { Difficulty, Exercise, ExerciseLevel, Lesson, LessonSection, CodeLab } from "./content/index.ts";
import type { Lesson } from "./content/index.ts";

export type Unit = { id:string; title:string; objective:string; lessonIds:string[] };
export type Chapter = Omit<SourceChapter,"professional"|"plain"> & { summary:string; units:Unit[]; lessonIds:string[] };
export type LearningStage = { id:string; eyebrow:string; title:string; description:string; chapterIds:number[]; color:string };

export const stages:LearningStage[] = [
  {id:"foundation",eyebrow:"STAGE 01",title:"概率与数理统计",description:"从随机性、分布和抽样出发，建立检验、估计与回归的共同语言。",chapterIds:[1,2,3,4,5,6,7,8,9],color:"#19736d"},
  {id:"social",eyebrow:"STAGE 02",title:"社会科学量化实践",description:"把模型放回研究设计、测量、因果、纵向资料和可复现工作流。",chapterIds:[10,11,12,13,14,15,16,17],color:"#ba6438"},
  {id:"doctoral",eyebrow:"STAGE 03",title:"博士研究方法",description:"覆盖质性、混合研究、高级推断、证据综合与博士论文完整实践。",chapterIds:[18,19,20,21,22,23,24],color:"#6b5794"}
];

const numerals=["一","二","三"];
function splitIntoUnits(items:Lesson[], count:number):Lesson[][] {
  return Array.from({length:count},(_,i)=>items.slice(Math.floor(i*items.length/count),Math.floor((i+1)*items.length/count)));
}

export const lessons:Lesson[] = authoredLessons.map(lesson=>({...lesson}));
export const chapters:Chapter[] = sourceChapters.map(source=>{
  const chapterLessons=lessons.filter(lesson=>lesson.chapterId===source.id);
  const unitCount=source.id<=12?3:2;
  const units=splitIntoUnits(chapterLessons,unitCount).map((group,i)=>{
    const id=`c${String(source.id).padStart(2,"0")}-u${i+1}`;
    group.forEach(lesson=>{lesson.unitId=id;});
    return {id,title:`单元${numerals[i]} · ${group[0].title}${group.length>1?`到${group.at(-1)?.title}`:""}`,objective:`完成本单元后，能够解释并审查${group.flatMap(x=>x.focus).slice(0,4).join("、")}。`,lessonIds:group.map(x=>x.id)};
  });
  return {id:source.id,part:source.part,title:source.title,level:source.level,topics:source.topics,useWhen:source.useWhen,advantage:source.advantage,caution:source.caution,formula:source.formula,caseStudy:source.caseStudy,summary:source.professional,units,lessonIds:chapterLessons.map(x=>x.id)};
});

export const lessonMap=new Map(lessons.map(lesson=>[lesson.id,lesson]));
export const chapterMap=new Map(chapters.map(chapter=>[chapter.id,chapter]));
export const totalUnits=chapters.reduce((sum,chapter)=>sum+chapter.units.length,0);
export const totalExercises=lessons.reduce((sum,lesson)=>sum+lesson.exercises.length,0);

export const learningPaths=[
  {title:"数理统计基础",description:"零起点到检验与回归",chapters:[1,2,4,5,6,7,8,9]},
  {title:"心理测量",description:"量表、潜变量与纵向变化",chapters:[10,12,14,21]},
  {title:"社会学量化",description:"调查、分类结果、多层与网络",chapters:[10,11,14,16]},
  {title:"因果推断",description:"从实验设计到高级识别",chapters:[13,20]},
  {title:"质性与混合研究",description:"扎根、民族志与证据整合",chapters:[18,19,24]},
  {title:"博士论文",description:"高级建模、综述与完整研究实践",chapters:[20,21,22,23,24]}
];
