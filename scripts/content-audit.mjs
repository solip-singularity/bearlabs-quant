import { chapters, lessons, stages, totalExercises, totalUnits } from "../lib/curriculum.ts";

const errors = [];
const expected = [7,8,7,7,6,9,9,11,8,7,7,7,9,7,6,7,6,8,7,8,8,8,7,6];
if (stages.length !== 3) errors.push(`学习阶段应为 3，实际 ${stages.length}`);
if (chapters.length !== 24) errors.push(`章节应为 24，实际 ${chapters.length}`);
if (totalUnits !== 60) errors.push(`单元应为 60，实际 ${totalUnits}`);
if (lessons.length !== 180) errors.push(`课程应为 180，实际 ${lessons.length}`);
if (totalExercises !== 1800) errors.push(`练习应为 1800，实际 ${totalExercises}`);

chapters.forEach((chapter, index) => {
  if (chapter.lessonIds.length !== expected[index]) errors.push(`第 ${chapter.id} 章课时错误`);
  if (chapter.topics.length < 6) errors.push(`第 ${chapter.id} 章知识点不足`);
});

const ids = new Set();
lessons.forEach((lesson) => {
  if (ids.has(lesson.id)) errors.push(`重复课时 ID ${lesson.id}`);
  ids.add(lesson.id);
  if (lesson.objectives.length < 4) errors.push(`${lesson.id} 学习目标不足`);
  if (lesson.sections.length < 5) errors.push(`${lesson.id} 正文小节不足`);
  if (lesson.sections.some(section => section.pro.length < 2 || section.kid.length < 2)) errors.push(`${lesson.id} 双版本内容不完整`);
  if (lesson.comparison.length < 3 || !lesson.python || !lesson.reportTemplate) errors.push(`${lesson.id} 方法比较、代码或报告缺失`);
  if (lesson.exercises.length !== 10) errors.push(`${lesson.id} 练习不是 10 题`);
  const levels = lesson.exercises.map(exercise => exercise.level);
  if (levels.filter(x => x === "简单").length !== 4 || levels.filter(x => x === "中等").length !== 4 || levels.filter(x => x === "困难").length !== 2) errors.push(`${lesson.id} 难度配比错误`);
  if (lesson.exercises.some(exercise => exercise.solution.steps.length < 3 || !exercise.solution.kid || !exercise.solution.pitfalls)) errors.push(`${lesson.id} 习题解析不完整`);
  if (lesson.chapterId >= 18 && !lesson.openTask) errors.push(`${lesson.id} 缺少博士开放任务`);
});

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`内容审计通过：${stages.length} 阶段、${chapters.length} 章、${totalUnits} 单元、${lessons.length} 课、${totalExercises} 道练习。`);
